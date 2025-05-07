from django.db.utils import IntegrityError
from django.test import TestCase

from referee.models import RefereeLicense


class TestRefereeLicense(TestCase):
    def setUp(self):
        self.license1 = RefereeLicense.objects.create(name="L1")
        self.license2 = RefereeLicense.objects.create(name="L2", parent=self.license1)
        self.license3 = RefereeLicense.objects.create(name="R1")
        self.license4 = RefereeLicense.objects.create(name="R2", parent=self.license3)
        self.license5 = RefereeLicense.objects.create(name="R3", parent=self.license4)

    def test_license_parents(self):
        self.assertTrue(self.license1.is_parent_of(self.license2))
        self.assertFalse(self.license2.is_parent_of(self.license1))
        self.assertFalse(self.license1.is_parent_of(self.license1))
        self.assertFalse(self.license1.is_parent_of(self.license3))
        self.assertFalse(self.license1.is_parent_of(self.license4))
        self.assertFalse(self.license1.is_parent_of(self.license5))
        self.assertFalse(self.license2.is_parent_of(self.license3))
        self.assertFalse(self.license2.is_parent_of(self.license4))
        self.assertFalse(self.license2.is_parent_of(self.license5))
        self.assertFalse(self.license3.is_parent_of(self.license1))
        self.assertFalse(self.license3.is_parent_of(self.license2))
        self.assertFalse(self.license3.is_parent_of(self.license3))
        self.assertTrue(self.license3.is_parent_of(self.license4))
        self.assertTrue(self.license3.is_parent_of(self.license5))

    def test_license_childs(self):
        self.assertFalse(self.license1.is_child_of(self.license1))
        self.assertFalse(self.license1.is_child_of(self.license2))
        self.assertFalse(self.license1.is_child_of(self.license3))
        self.assertFalse(self.license1.is_child_of(self.license4))
        self.assertFalse(self.license1.is_child_of(self.license5))
        self.assertTrue(self.license2.is_child_of(self.license1))
        self.assertFalse(self.license2.is_child_of(self.license2))
        self.assertFalse(self.license2.is_child_of(self.license3))
        self.assertFalse(self.license2.is_child_of(self.license4))
        self.assertFalse(self.license2.is_child_of(self.license5))
        self.assertFalse(self.license5.is_child_of(self.license1))
        self.assertFalse(self.license5.is_child_of(self.license2))
        self.assertTrue(self.license5.is_child_of(self.license3))
        self.assertTrue(self.license5.is_child_of(self.license4))
        self.assertFalse(self.license5.is_child_of(self.license5))

    def test_license_gt(self):
        self.assertTrue(self.license1 > self.license2)
        self.assertFalse(self.license2 > self.license1)
        self.assertFalse(self.license1 > self.license1)
        self.assertFalse(self.license1 > self.license3)
        self.assertFalse(self.license1 > self.license4)
        self.assertFalse(self.license1 > self.license5)
        self.assertFalse(self.license2 > self.license3)
        self.assertFalse(self.license2 > self.license4)
        self.assertFalse(self.license2 > self.license5)
        self.assertFalse(self.license3 > self.license1)
        self.assertFalse(self.license3 > self.license2)
        self.assertFalse(self.license3 > self.license3)
        self.assertTrue(self.license3 > self.license4)
        self.assertTrue(self.license3 > self.license5)

    def test_license_lt(self):
        self.assertFalse(self.license1 < self.license1)
        self.assertFalse(self.license1 < self.license2)
        self.assertFalse(self.license1 < self.license3)
        self.assertFalse(self.license1 < self.license4)
        self.assertFalse(self.license1 < self.license5)
        self.assertTrue(self.license2 < self.license1)
        self.assertFalse(self.license2 < self.license2)
        self.assertFalse(self.license2 < self.license3)
        self.assertFalse(self.license2 < self.license4)
        self.assertFalse(self.license2 < self.license5)
        self.assertFalse(self.license5 < self.license1)
        self.assertFalse(self.license5 < self.license2)
        self.assertTrue(self.license5 < self.license3)
        self.assertTrue(self.license5 < self.license4)

    def test_license_ge(self):
        self.assertTrue(self.license1 >= self.license2)
        self.assertFalse(self.license2 >= self.license1)
        self.assertTrue(self.license1 >= self.license1)
        self.assertFalse(self.license1 >= self.license3)
        self.assertFalse(self.license1 >= self.license4)
        self.assertFalse(self.license1 >= self.license5)
        self.assertTrue(self.license2 >= self.license2)
        self.assertFalse(self.license2 >= self.license3)
        self.assertFalse(self.license2 >= self.license4)
        self.assertFalse(self.license2 >= self.license5)
        self.assertFalse(self.license3 >= self.license1)
        self.assertFalse(self.license3 >= self.license2)
        self.assertTrue(self.license3 >= self.license3)
        self.assertTrue(self.license3 >= self.license4)
        self.assertTrue(self.license3 >= self.license5)

    def test_license_le(self):
        self.assertTrue(self.license1 <= self.license1)
        self.assertFalse(self.license1 <= self.license2)
        self.assertFalse(self.license1 <= self.license3)
        self.assertFalse(self.license1 <= self.license4)
        self.assertFalse(self.license1 <= self.license5)
        self.assertTrue(self.license2 <= self.license1)
        self.assertTrue(self.license2 <= self.license2)
        self.assertFalse(self.license2 <= self.license3)
        self.assertFalse(self.license2 <= self.license4)
        self.assertFalse(self.license2 <= self.license5)
        self.assertFalse(self.license5 <= self.license1)
        self.assertFalse(self.license5 <= self.license2)
        self.assertTrue(self.license5 <= self.license3)
        self.assertTrue(self.license5 <= self.license4)
        self.assertTrue(self.license5 <= self.license5)

    def test_uniqueness(self):
        with self.assertRaises(IntegrityError):
            RefereeLicense.objects.create(name=self.license1.name)
