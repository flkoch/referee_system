# Generated by Django 5.2 on 2025-05-07 05:43

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("helper", "0002_alter_location_address"),
    ]

    operations = [
        migrations.AlterField(
            model_name="address",
            name="area_code",
            field=models.CharField(
                default="", max_length=15, verbose_name="Postal code"
            ),
        ),
        migrations.AlterField(
            model_name="address",
            name="country",
            field=models.CharField(default="", max_length=100, verbose_name="Country"),
        ),
        migrations.AlterField(
            model_name="address",
            name="house_number",
            field=models.CharField(
                default="", max_length=10, verbose_name="House number"
            ),
        ),
        migrations.AlterField(
            model_name="location",
            name="description",
            field=models.TextField(default="", verbose_name="Description"),
        ),
    ]
