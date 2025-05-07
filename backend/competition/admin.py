from django.contrib import admin

from competition.models import (
    Accommodation,
    Application,
    Competition,
    CompetitionCategory,
    Event,
    Invitation,
)

# Register your models here.

admin.site.register(Event)
admin.site.register(Competition)
admin.site.register(CompetitionCategory)
admin.site.register(Accommodation)
admin.site.register(Application)
admin.site.register(Invitation)
