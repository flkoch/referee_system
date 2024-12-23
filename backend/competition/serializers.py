from rest_framework import serializers

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
            "aplication_close",
            "created",
            "modified",
        ]
        read_only_fields = ["created", "modified"]


class CompetitionCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = CompetitionCategory
        fields = ["id", "name", "parent"]


class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = [
            "id",
            "name",
            "location",
            "start",
            "end",
            "created",
            "modified",
            "creator",
            "info",
            "slug",
        ]
        read_only_fields = ["created", "modified", "creator"]


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
