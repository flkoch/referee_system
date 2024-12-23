from django.test import TestCase
from django.contrib.auth.models import User
from django.utils import timezone

from competition.models import Event
from helper.models import Location


class TestCompetitionModel(TestCase):
    def setUp(self):
        self.user1 = User.objects.create_user(username="John", email="john@test.com")
        self.user2 = User.objects.create_user(username="Jane", email="jane@test.com")
        self.location = Location.objects.create(name="Test Location")
        self.event1 = Event.create(
            name="Test Event",
            location=self.location,
            start=timezone.datetime(
                2024, 12, 1, 8, 30, tzinfo=timezone.get_current_timezone()
            ),
        )
        self.event2 = Event.create(
            name="Test Event",
            location=self.location,
            start=timezone.datetime(
                2024, 12, 10, 9, 32, tzinfo=timezone.get_current_timezone()
            ),
            end=timezone.datetime(
                2024, 12, 10, 18, 32, tzinfo=timezone.get_current_timezone()
            ),
        )

    def test_competition_creation(self):
        pass
