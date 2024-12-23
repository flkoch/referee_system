# Generated by Django 5.1.4 on 2024-12-23 15:57

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("helper", "0001_initial"),
    ]

    operations = [
        migrations.AlterField(
            model_name="location",
            name="address",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                to="helper.address",
            ),
        ),
    ]