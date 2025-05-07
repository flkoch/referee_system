from django.contrib.auth.models import User
from django.test import TestCase
from django.utils import timezone

from referee.models import Examination, Referee, RefereeLicense

# Create your tests here.


class RefereeTestCase(TestCase):
    def setUp(self):
        self.admin = User.objects.create_superuser(
            username="test-admin",
            email="admin@test.com",
            password="test-password",
            first_name="John",
        )
        self.user1 = User.objects.create_user(
            username="user",
            email="user@test.com",
            password="user-password",
            last_name="Wayne",
        )
        self.user2 = User.objects.create_user(
            username="second-user",
            email="2@test.com",
            password="user-password",
        )
        self.license1 = RefereeLicense.objects.create(name="test")
        self.license2 = RefereeLicense.objects.create(
            name="sub_test", parent=self.license1
        )
        self.admin.referee.dob = "01/01/1990"

    def test_profile(self):
        self.assertIsInstance(self.admin.referee, Referee)
        self.assertIsInstance(self.user1.referee, Referee)
        self.assertIsInstance(self.user2.referee, Referee)

    def test_referee_name(self):
        self.assertEqual(str(self.admin.referee), "John")
        self.assertEqual(str(self.user1.referee), "Wayne")
        self.assertEqual(str(self.user2.referee), "second-user")

    def test_license_property(self):
        self.assertQuerySetEqual(self.admin.referee.licenses, [])

    def test_is_qualified(self):
        self.assertQuerySetEqual(self.user1.referee.licenses, [])
        Examination.objects.create(
            candidate=self.user1.referee,
            license=self.license1,
            date=timezone.now(),
            passed=True,
        )
        self.assertQuerySetEqual(self.user1.referee.licenses, [self.license1.name])
        self.assertQuerySetEqual(self.user2.referee.licenses, [])
        Examination.objects.create(
            candidate=self.user2.referee,
            license=self.license2,
            date=timezone.now(),
            passed=True,
        )
        self.assertQuerySetEqual(self.user2.referee.licenses, [self.license2.name])
        self.assertTrue(self.user1.referee.is_qualified(self.license1))
        self.assertTrue(self.user1.referee.is_qualified(self.license2))
        self.assertFalse(self.user2.referee.is_qualified(self.license1))
        self.assertTrue(self.user2.referee.is_qualified(self.license2))
