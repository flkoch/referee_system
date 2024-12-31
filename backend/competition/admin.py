from django.contrib import admin

from competition.models import (
    Event,
    Competition,
    CompetitionCategory,
    Accommodation,
    Application,
    Invitation,
)

# Register your models here.

admin.site.register(Event)
admin.site.register(Competition)
admin.site.register(CompetitionCategory)
admin.site.register(Accommodation)
admin.site.register(Application)
admin.site.register(Invitation)
