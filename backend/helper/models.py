from django.db import models
from django.utils.translation import gettext as _


# Create your models here.
def _list_items_as_string(*args):
    """
    Helper function returning a list of strings from *args
    """
    return [str(item) for item in args if item is not None]


class Address(models.Model):
    """
    Class to store a regular address
    composed of fields for street, house number, area code, city and country
    string representation gives comma separated concatenation
    """

    street = models.CharField(max_length=150, verbose_name=_("Street"))
    house_number = models.CharField(
        max_length=10, verbose_name=_("House number"), blank=True, null=True
    )
    area_code = models.CharField(
        max_length=15, verbose_name=_("Postal code"), blank=True, null=True
    )
    city = models.CharField(max_length=180, verbose_name=_("City"))
    country = models.CharField(
        max_length=100, verbose_name=_("Country"), blank=True, null=True
    )

    class Meta:
        verbose_name = _("Address")
        verbose_name_plural = _("Addresses")
        ordering = ["country", "city", "street", "house_number"]

    def __str__(self):
        """
        return string of comma separated concatenation of fields
        """
        line = ", ".join(
            [
                " ".join(_list_items_as_string(self.street, self.house_number)),
                " ".join(_list_items_as_string(self.area_code, self.city)),
                self.country,
            ]
        )
        return line


class Location(models.Model):
    """
    Class to store a location as combination of a name, description and an
    instance of the previous address class.
    """

    name = models.CharField(max_length=50, verbose_name=_("Name"))
    description = models.TextField(verbose_name=_("Description"), blank=True, null=True)
    address = models.ForeignKey(
        Address, blank=True, null=True, on_delete=models.CASCADE
    )

    class Meta:
        verbose_name = _("Location")
        verbose_name_plural = _("Locations")
        ordering = ["name"]

    def __str__(self):
        """
        return string representation as name
        """
        return self.name

    @property
    def with_address(self):
        """
        return string representation including the address, separedt by comma
        """
        return ", ".join(_list_items_as_string(self, self.address))
