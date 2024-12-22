from django.contrib import admin

from referee.models import Examination, Referee, RefereeLicense

# Register your models here.
admin.site.register(Referee)
admin.site.register(RefereeLicense)
admin.site.register(Examination)
