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

    def create(self, validated_data):
        address_data = validated_data.pop("address")
        address = Address.objects.get_or_create(**address_data)
        location = Location.objects.create(address=address, **validated_data)
        return location

    def update(self, instance, validated_data):
        loc_id = validated_data.pop("id")
        address_data = validated_data.pop("address")
        add_id = address_data.pop("id")
        address = (  # noqa: F841
            Address.objects.filter(pk=add_id).select_for_update().update(**address_data)
        )
        location = (  # noqa: F841
            Location.objects.filter(pk=loc_id)
            .select_for_update()
            .update(**validated_data)
        )
