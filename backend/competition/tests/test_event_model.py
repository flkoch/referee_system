from time import sleep
from django.test import TestCase
from django.contrib.auth.models import User
from django.utils import timezone

from competition.models import Event
from helper.models import Location


class TestEventModel(TestCase):
    def setUp(self):
        self.location = Location.objects.create(name="Test Location")

    def test_event_creation(self):
        self.event1 = Event.create(
            name="Test Event",
            location=self.location,
            start=timezone.datetime(
                2024, 12, 1, 8, 30, tzinfo=timezone.get_current_timezone()
            ),
        )
        self.assertIsInstance(self.event1, Event)
        self.assertEqual(self.event1.slug, "test-event")
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
        self.assertIsInstance(self.event2, Event)
        self.assertEqual(self.event2.slug, "test-event-1")
        self.assertQuerySetEqual(Event.objects.all(), [self.event1, self.event2])
        self.assertEqual(str(self.event1), "Test Event")
        self.assertEqual(str(self.event2), "Test Event")
        self.assertNotEqual(self.event1, self.event2)
        self.assertEqual(self.event1.date, "01 Dec 2024")
        self.assertEqual(self.event2.date, "10 Dec 2024 - 10 Dec 2024")
        self.assertLess(
            (self.event1.modified - self.event1.created).total_seconds(), 1e-3
        )
        self.assertLess(
            (self.event2.modified - self.event2.created).total_seconds(), 1e-3
        )
        sleep(1)
        self.event2.info = "Test info"
        self.event2.save()
        self.assertGreaterEqual(
            (self.event2.modified - self.event2.created).total_seconds(), 0.1
        )
        self.assertEqual(Event.objects.get(pk=self.event2.id).info, "Test info")
