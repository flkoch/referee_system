from rest_framework import serializers

from helper.models import Address, Location


class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = ["id", "street", "house_number", "area_code", "city", "country"]


class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Location
        fields = ["id", "name", "description", "address"]
