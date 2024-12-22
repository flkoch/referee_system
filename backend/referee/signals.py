from django.db.models.signals import post_save
from django.contrib.auth.models import User
from django.dispatch import receiver
from .models import Referee


@receiver(post_save, sender=User)
def create_referee_profile(sender, instance, created, **kwargs):
    if created:
        Referee.objects.create(user=instance)
