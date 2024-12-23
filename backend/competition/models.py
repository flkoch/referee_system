from django.db import models
from django.contrib.auth.models import User
from django.core import mail
from django.core.validators import MaxValueValidator, MinValueValidator
from django.shortcuts import get_object_or_404
from django.utils import timezone
from django.utils.text import slugify
from django.utils.translation import gettext_lazy as _
from django.template.loader import render_to_string

from referee.models import Referee, RefereeLicense, RefereeRole
from helper.models import Address, Category, Location
from .tasks import send_mails


def _prepare_mail(*args, **kwargs):
    m = mail.EmailMultiAlternatives(*args, **kwargs)
    html = render_to_string("e-mail.html", {"message", kwargs["body"]})
    m.attach_alternative(html, "text/html")
    return m


class CompetitionCategory(Category):
    class Meta:
        verbose_name = _("Competition CAtegory")
        verbose_name_plural = _("Competition Categories")


class Event(models.Model):
    """
    Event class to store event details
    """

    name = models.CharField(max_length=240, verbose_name=_("Name"))
    location = models.ForeignKey(Location, on_delete=models.PROTECT)
    start = models.DateTimeField()
    end = models.DateTimeField(blank=True, null=True, default=None)
    created = models.DateTimeField(auto_now_add=True)
    modified = models.DateTimeField(auto_now=True)
    creator = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
        related_name=_("event_creator"),
        related_query_name="event_creator",
    )
    info = models.TextField(verbose_name=_("Information"), blank=True)
    slug = models.SlugField(unique_for_year="start")

    class Meta:
        ordering = ["start", "end", "name"]
        verbose_name = _("Event")
        verbose_name_plural = _("Events")

    @classmethod
    def create(cls, name: str, start: timezone.datetime, **kwargs):
        slug = slugify(name)
        if "slug" in kwargs:
            slug = kwargs["slug"]
        qs = Event.objects.filter(slug=slug).filter(start__year=start.year)
        if qs.count() > 0:
            slug += f"-{qs.count()}"
        return Event.objects.create(name=name, start=start, slug=slug, **kwargs)

    def __str__(self) -> str:
        """
        Return the name as the string representation.
        """
        return f"{self.name}"

    @property
    def date(self) -> str:
        if self.end is None:
            return f"{self.start:%d %b %Y}"
        return f"{self.start:%d %b %Y} - {self.end:%d %b %Y}"


class Competition(models.Model):
    event = models.ForeignKey(
        Event,
        related_name=_("Competition"),
        related_query_name="competition",
        on_delete=models.CASCADE,
    )
    invitor = models.ForeignKey(Referee, on_delete=models.PROTECT)
    minimum_level = models.ForeignKey(
        RefereeLicense,
        on_delete=models.PROTECT,
        related_name="+",
    )
    desired_level = models.ForeignKey(
        RefereeLicense,
        on_delete=models.PROTECT,
        related_name="+",
    )
    start = models.DateTimeField()
    duration = models.DurationField()
    competition_fields = models.IntegerField(
        validators=[MaxValueValidator(25), MinValueValidator(1)],
        blank=True,
        null=True,
    )
    category = models.ManyToManyField(CompetitionCategory, verbose_name=_("Category"))
    info = models.TextField(verbose_name=_("Information"), blank=True)
    head_referee = models.ForeignKey(
        Referee,
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
        related_name="+",
    )
    referees = models.IntegerField(
        verbose_name=_("Number of Referees"),
        validators=[MinValueValidator(1), MaxValueValidator(100)],
        blank=True,
        null=True,
    )
    observer = models.IntegerField(
        verbose_name=_("Number of Observers"),
        validators=[MinValueValidator(1), MaxValueValidator(25)],
        blank=True,
        null=True,
    )
    application_open = models.DateTimeField(
        verbose_name=_("Registration Open"), blank=True, null=True
    )
    application_close = models.DateTimeField(
        verbose_name=_("Registration Close"), blank=True, null=True
    )
    application = models.BooleanField(
        verbose_name=_("Allow Registration"), default=True
    )
    created = models.DateTimeField(auto_now_add=True)
    modified = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["start", "referees"]
        verbose_name = _("Competition")
        verbose_name_plural = _("Competitions")

    def __str__(self) -> str:
        """
        Return the name of the associated event and the date as the string representation.
        """
        return f"{self.event.name} ({self.start.date()})"

    def application_allowed(self, user: Referee | None = None) -> bool:
        """
        Check if application is currently possible.
        """
        if not self.application:
            return False
        now = timezone.now()
        if now < self.application_open:
            return False
        if now > self.application_close:
            return False
        if user is None:
            return True
        for l in user.licenses():
            license = get_object_or_404(RefereeLicense, name=l)
            if self.minimum_level < license:
                return True
        return False


class Accommodation(models.Model):
    class RoomType(models.IntegerChoices):
        PRIVATE = 0, _("Private")
        SINGLE_S = 1, _("Single room (surcharge)")
        DOUBLE = 2, _("Double room")
        TIRPLE = 3, _("Triple room")
        SINGLE = 10, _("Single room")
        DORM = 11, _("Dorm")

    event = models.ForeignKey(Event, on_delete=models.CASCADE)
    name = models.CharField(max_length=240, verbose_name=_("Name of Accommodation"))
    start = models.DateTimeField(
        blank=True, null=True, verbose_name=_("Earliest Check-in")
    )
    end = models.DateTimeField(blank=True, null=True, verbose_name=_("Lates Check-out"))
    type = models.IntegerField(
        verbose_name=_("Room Type"),
        choices=RoomType,
        default=RoomType.DOUBLE,
    )
    info = models.TextField(verbose_name=_("Information"), blank=True)
    address = models.ForeignKey(Address, on_delete=models.PROTECT)

    class Meta:
        ordering = ["start", "end", "name"]
        verbose_name = _("Accommodation")
        verbose_name_plural = _("Accommodations")

    def __str__(self) -> str:
        return self.name


class Application(models.Model):
    class Status(models.IntegerChoices):
        NOSHOW = -4, _("No Show")
        DECLINED = -3, _("Declined")
        CANCLED = -2, _("Cancled")
        NOTSELECTED = -1, _("Not selected")
        APPLIED = 0, _("Applied")
        SELECTED = 1, _("Selected")
        INVITED = 2, _("Invited")
        PARTICIPATED = 3, _("Participated")

    user = models.ForeignKey(Referee, on_delete=models.CASCADE)
    created = models.DateTimeField(auto_now_add=True)
    modified = models.DateTimeField(auto_now=True)
    accommodation = models.ForeignKey(
        Accommodation, on_delete=models.PROTECT, blank=True, null=True
    )
    accommodation_arrival = models.DateField(
        verbose_name=_("Arrival Day"), blank=True, null=True
    )
    accommodation_departure = models.DateField(
        verbose_name=_("Departure Day"), blank=True, null=True
    )
    accommodation_remark = models.TextField(verbose_name=_("Information"), blank=True)
    competition = models.ForeignKey(
        Competition,
        on_delete=models.PROTECT,
        related_name=_("Applications"),
        related_query_name="applications",
    )
    status = models.IntegerField(choices=Status, default=Status.APPLIED)
    role = models.ForeignKey(RefereeRole, on_delete=models.PROTECT)

    class Meta:
        order_with_respect_to = "user"
        verbose_name = _("Application")
        verbose_name_plural = _("Applicatoins")


class Invitation(models.Model):
    competition = models.OneToOneField(
        Competition,
        verbose_name=_("Invitation"),
        on_delete=models.CASCADE,
        blank=True,
        null=True,
    )
    previous_invitation = models.OneToOneField(
        "self",
        on_delete=models.SET_NULL,
        verbose_name=_("previous invitation"),
        blank=True,
        null=True,
        related_name="updated_invitation",
        related_query_name="update",
    )
    invited = models.ManyToManyField(
        Application,
        verbose_name=_("Invited"),
        related_name="invitation",
        related_query_name="invitation",
    )
    send_copy = models.ManyToManyField(User)
    subject = models.CharField(max_length=240)
    message = models.TextField(blank=True)
    created = models.DateTimeField(auto_now_add=True)
    sent = models.DateTimeField(blank=True, null=True)

    class Meta:
        ordering = ["created", "sent"]

    @property
    def is_current(self):
        if self.competition is None:
            return False
        if self.is_sent:
            return True
        return False

    @property
    def is_sent(self):
        if self.sent is None:
            return False
        if self.sent < timezone.now():
            return True
        raise ValueError("Sending time is in the future. Timeinfo mismatch.")

    def send(self, sender: User | None = None):
        messages = []
        for a in self.invited:
            messages.append(
                _prepare_mail(
                    subject=self.subject,
                    body=self.message,
                    to=a.user.user.email,
                    reply_to=sender.email if not sender is None else "",
                )
            )
        for a in self.send_copy:
            messages.append(
                _prepare_mail(
                    subject=self.subject,
                    body=self.message,
                    to=a.email,
                    reply_to=sender.email if not sender is None else "",
                )
            )
        send_mails(messages)
        self.sent = timezone.now()
