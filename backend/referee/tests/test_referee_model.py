from django.test import TestCase
from referee.models import Referee, RefereeLicense, Examination
from django.contrib.auth.models import User

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
            username="second-user", email="2@test.com", password="user-password"
        )

    def check_profile(self):
        self.assertIsInstance(self.admin.referee, Referee)

    def test_referee_name(self):
        self.assertEqual(self.admin.referee.name, "John")
