from django.test import TestCase
from django.contrib.auth.models import User

from referee.models import Examination, RefereeLicense


class TestExamination(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="John", email="john@test.com", password="1234", first_name="John"
        )

        self.license1 = RefereeLicense.objects.create(name="L1")
        self.license2 = RefereeLicense.objects.create(name="L2", parent=self.license1)
        self.exam1 = Examination.create(
            candidate=self.user, license=self.license1, date="2008-01-01"
        )
        self.exam2 = Examination.create(
            candidate=self.user, license=self.license2, date="2012-01-01"
        )

    def test_exam_ordering(self):
        qs = Examination.objects.all()
        self.assertQuerySetEqual(qs, [self.exam2, self.exam1])

    def test_str_representation(self):
        self.assertEqual(str(self.exam1), f"L1: {self.user.referee.name} (passed)")
