from rest_framework import serializers
from .models import Complaint

class ComplaintSerializer(serializers.ModelSerializer):
    citizen = serializers.ReadOnlyField(source="citizen.username")

    class Meta:
        model = Complaint
        fields = ["id", "citizen", "title", "description", "status", "created_at", "updated_at"]
        read_only_fields = ["status", "created_at", "updated_at"]

