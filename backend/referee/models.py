from django.db import models
from django.contrib.auth.models import User
from django.utils.translation import gettext as _

from django.utils import timezone

from helper.models import Address


class RefereeLicense(models.Model):
    name = models.CharField(max_length=50, unique=True, verbose_name=_("Name"))
    parent = models.ForeignKey(
        "self",
        on_delete=models.SET_NULL,
        default=None,
        related_name="children",
        related_query_name="child",
        null=True,
        blank=True,
        verbose_name=_("next higher license"),
    )

    class Meta:
        verbose_name = _("Referee license")
        verbose_name_plural = _("Referee licenses")

    def is_parent_of(self, other: any) -> bool:
        """
        is_parent_of
        checks wether the other object is a hirarchically below this instance

        Args:
            other (any): object to compare against

        Returns:
            bool: True if the other object is hirarchically a decendent of this instance.
        """
        if not isinstance(other, RefereeLicense):
            raise TypeError(
                f"{other} is of type {type(other)} which cannot be compared with {type(self)}."
            )
        if other.parent is None:
            return False
        if other.parent == self:
            return True
        return self.is_parent_of(other.parent)

    def is_child_of(self, other: any) -> bool:
        """
        is_child_of
        checks wether the other object is hirarchically above this instance

        Args:
            other (any): other object to compare against

        Returns:
            bool: True if the other object is hirarchically an ancestor of this instance
        """
        if not isinstance(other, RefereeLicense):
            raise TypeError(
                f"{other} is of type {type(other)} which cannot be compared with {type(self)}."
            )
        if self.parent is None:
            return False
        if self.parent.id == other.id:
            return True
        return self.parent.is_child_of(other)

    def __lt__(self, other: any) -> bool:
        return self.is_child_of(other)

    def __gt__(self, other: any) -> bool:
        return self.is_parent_of(other)

    def __le__(self, other: any) -> bool:
        return self < other or self == other

    def __ge__(self, other: any) -> bool:
        return self > other or self == other

    def __str__(self):
        return self.name


class Referee(models.Model):
    """
    Referee
    User profile containing additional information required for referees.

    Fields:
        user (User): User this profile belongs to
        license (RefereeLicense): Highest license this person currently holds
        address (Address): Living address of the person
        dob (Date): Date of Birth of the person
    """

    user = models.OneToOneField(User, on_delete=models.CASCADE, verbose_name=_("User"))
    address = models.ForeignKey(
        Address,
        on_delete=models.PROTECT,
        null=True,
        blank=True,
        related_name="domiciled",
        related_query_name="domiciled",
    )
    dob = models.DateField(
        verbose_name=_("Date of Birth"),
        blank=True,
        null=True,
    )
    iban = models.CharField(max_length=34, verbose_name=_("IBAN"), blank=True)

    class Meta:
        verbose_name = _("Referee Profile")
        order_with_respect_to = "user"

    @property
    def passed_exams(self) -> models.QuerySet:
        return self.exams.filter(passed=True)

    @property
    def licenses(self) -> models.QuerySet:
        return self.passed_exams.values_list("license__name", flat=True)

    @property
    def name(self) -> str:
        if self.user.first_name or self.user.last_name:
            return " ".join([self.user.first_name, self.user.last_name]).strip()
        return self.user.username

    def licenses_below(self, child_of: RefereeLicense) -> list[RefereeLicense]:
        if not isinstance(child_of, RefereeLicense):
            raise TypeError(f"{child_of} must be of type {type(self)}.")
        return [l for l in self.licenses if l < child_of]

    def is_qualified(self, qualification: RefereeLicense) -> bool:
        for l in self.licenses:
            if RefereeLicense.objects.get(name=l) >= qualification:
                return True
        return False

    def __str__(self) -> str:
        if not self.user.first_name and not self.user.last_name:
            return self.user.username
        return self.name


class Examination(models.Model):
    """
    Examination
    Classe to store information on an examination

    Fields:
        candidate (Referee): Candidate who took the exam
        license (RefereeLicense): License the examinee was testing for
        chief_examiner (Referee): Examiner responsible for the examination (optional)
        date (date): Date when the exam was carried out
        address (Address): Address of where the exam was held (optional)
        grade (float): Grade achieved in the exam (optional)
        passed (bool): Indication whether the exam was passed or not
        note_internal (text): note for the examination committee
        note_public (text): note to the examinee
    """

    candidate = models.ForeignKey(
        Referee,
        on_delete=models.CASCADE,
        related_name="exams",
        related_query_name="exam",
        verbose_name=_("Candidate"),
    )
    license = models.ForeignKey(
        RefereeLicense,
        on_delete=models.PROTECT,
        related_name="exams",
        related_query_name="exam",
        verbose_name=_("License"),
    )
    chief_examiner = models.ForeignKey(
        Referee,
        on_delete=models.SET_NULL,
        related_name="examined",
        null=True,
        blank=True,
        verbose_name=_("Chief Examiner"),
    )
    date = models.DateField(verbose_name=_("Examination Date"))
    address = models.ForeignKey(
        Address,
        on_delete=models.PROTECT,
        verbose_name=_("Address"),
        null=True,
        blank=True,
        related_name="exams",
        related_query_name="exam",
    )
    grade = models.DecimalField(
        verbose_name=_("Grade"),
        null=True,
        blank=True,
        decimal_places=2,
        max_digits=4,
    )
    passed = models.BooleanField(verbose_name=_("Passed"), default=True)
    note_internal = models.TextField(verbose_name=_("Note (internal)"), blank=True)
    note_external = models.TextField(_("Note (external)"), blank=True)

    @classmethod
    def create(self, candidate, **kwargs):
        if isinstance(candidate, User):
            candidate = candidate.referee
        return Examination.objects.create(candidate=candidate, **kwargs)

    class Meta:
        verbose_name = _("Examination")
        verbose_name_plural = _("Examinations")
        ordering = ["-date"]

    def __str__(self) -> str:
        return f"{self.license}: {self.candidate.name} ({_('passed') if self.passed else _('failed')})"
