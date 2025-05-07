from rest_framework import serializers

from referee.models import Examination, Referee, RefereeLicense, RefereeRole


class ExaminationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Examination
        fields = [
            "id",
            "candidate",
            "license",
            "chief_examiner",
            "date",
            "address",
            "grade",
            "passed",
            "note_internal",
            "note_external",
        ]


class RefereeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Referee
        fields = ["id", "address", "dob", "iban", "phone", "mobile"]
        read_only_fields = ["id"]


class RefereeLicenseSerializer(serializers.ModelSerializer):
    class Meta:
        model = RefereeLicense
        fields = ["id", "name", "parent"]


class RefereeRoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = RefereeRole
        fields = ["id", "name", "order"]
