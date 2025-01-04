from rest_framework import serializers
from rest_framework.validators import UniqueForYearValidator, UniqueTogetherValidator

from helper.serializers import LocationSerializer
from competition.models import (
    Accommodation,
    Application,
    Competition,
    CompetitionCategory,
    Event,
    Invitation,
)


class AccommodationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Accommodation
        fields = ["id", "event", "name", "start", "end", "address", "info", "type"]
        validators = [
            UniqueTogetherValidator(
                Accommodation.objects.all(),
                fields=["name", "event"],
                message="The accommodation name must be unique for each event.",
            )
        ]


class ApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Application
        fields = [
            "id",
            "user",
            "created",
            "modified",
            "accommodation",
            "accommodation_arrival",
            "accommodation_departure",
            "accommodation_remark",
            "competition",
            "status",
            "role",
        ]
        read_only_fields = ["created", "modified"]
        validators = [
            UniqueTogetherValidator(
                queryset=Application.objects.all(),
                fields=["user", "competition"],
                message="There must not be more than one application for an event per referee.",
            )
        ]


class CompetitionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Competition
        fields = [
            "id",
            "event",
            "invitor",
            "minimum_level",
            "desired_level",
            "start",
            "duration",
            "competition_fields",
            "category",
            "info",
            "head_referee",
            "referees",
            "observers",
            "application",
            "application_open",
            "application_close",
            "created",
            "modified",
        ]
        read_only_fields = ["created", "modified"]


class CompetitionCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = CompetitionCategory
        fields = ["id", "name", "parent"]


class EventSerializer(serializers.ModelSerializer):
    location = LocationSerializer(many=False, read_only=True)
    competitions = CompetitionSerializer(many=True, read_only=True)

    class Meta:
        model = Event
        fields = [
            "id",
            "name",
            "location",
            "competitions",
            "start",
            "end",
            "created",
            "modified",
            "creator",
            "info",
            "slug",
            "accommodations",
        ]
        read_only_fields = ["created", "modified", "creator"]
        validators = [
            UniqueForYearValidator(
                queryset=Event.objects.all(),
                field="slug",
                date_field="start",
                message="Slug must be unique for each calendar year.",
            )
        ]


class InvitationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Invitation
        fields = [
            "id",
            "competition",
            "previous_invitation",
            "invited",
            "send_copy",
            "subject",
            "message",
            "created",
            "sent",
        ]
        read_only_fields = ["created", "sent", "previous_invitation"]
