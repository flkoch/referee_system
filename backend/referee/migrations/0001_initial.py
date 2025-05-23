# Generated by Django 5.1.4 on 2024-12-22 11:34

import datetime

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        ("helper", "0001_initial"),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name="Referee",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("dob", models.DateField(verbose_name="Date of Birth")),
                ("iban", models.CharField(max_length=34)),
                (
                    "address",
                    models.ForeignKey(
                        blank=True,
                        null=True,
                        on_delete=django.db.models.deletion.PROTECT,
                        related_name="domiciled",
                        related_query_name="domiciled",
                        to="helper.address",
                    ),
                ),
                (
                    "user",
                    models.OneToOneField(
                        on_delete=django.db.models.deletion.CASCADE,
                        to=settings.AUTH_USER_MODEL,
                        verbose_name="User",
                    ),
                ),
            ],
            options={
                "verbose_name": "Referee Profile",
                "order_with_respect_to": "user",
            },
        ),
        migrations.CreateModel(
            name="RefereeLicense",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "name",
                    models.CharField(max_length=50, unique=True, verbose_name="Name"),
                ),
                (
                    "parent",
                    models.ForeignKey(
                        blank=True,
                        default=None,
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        related_name="children",
                        related_query_name="child",
                        to="referee.refereelicense",
                        verbose_name="next higher license",
                    ),
                ),
            ],
            options={
                "verbose_name": "Referee license",
                "verbose_name_plural": "Referee licenses",
            },
        ),
        migrations.CreateModel(
            name="Examination",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "date",
                    models.DateField(
                        default=datetime.date(2024, 12, 22),
                        verbose_name="Examination Date",
                    ),
                ),
                (
                    "grade",
                    models.DecimalField(
                        blank=True,
                        decimal_places=2,
                        max_digits=4,
                        null=True,
                        verbose_name="Grade",
                    ),
                ),
                ("passed", models.BooleanField(default=True, verbose_name="Passed")),
                ("note_internal", models.TextField(verbose_name="Note (internal)")),
                ("note_external", models.TextField(verbose_name="Note (external)")),
                (
                    "address",
                    models.ForeignKey(
                        blank=True,
                        null=True,
                        on_delete=django.db.models.deletion.PROTECT,
                        related_name="exams",
                        related_query_name="exam",
                        to="helper.address",
                        verbose_name="Address",
                    ),
                ),
                (
                    "candidate",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="exams",
                        related_query_name="exam",
                        to="referee.referee",
                        verbose_name="Candidate",
                    ),
                ),
                (
                    "chief_examiner",
                    models.ForeignKey(
                        blank=True,
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        related_name="examined",
                        to="referee.referee",
                        verbose_name="Chief Examiner",
                    ),
                ),
                (
                    "license",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.PROTECT,
                        related_name="exams",
                        related_query_name="exam",
                        to="referee.refereelicense",
                        verbose_name="License",
                    ),
                ),
            ],
            options={
                "verbose_name": "Examination",
                "verbose_name_plural": "Examinations",
                "ordering": ["-date"],
            },
        ),
    ]
