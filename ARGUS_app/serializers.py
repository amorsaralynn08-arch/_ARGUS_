from rest_framework import serializers
from .models import *

class SensorReadingSerializer(serializers.ModelSerializer):
    class Meta:
        model = SensorReading
        fields =  [
            "id",
            "vehicle",
            "temperature",
            "vibration",
            "potentiometer_value",
            "created_at",
        ]
        read_only_fields = ["created_at"]

def validate_temperature(self,value):
    if value < -40 or value >150:
        raise serializers.ValidationError("Temperature must be within the 40°C and 150°C threshhold")
    return value

def validate_vibration(self,value):
    if value < 0:
        raise serializers.ValidationError("Vibrations cannot be negative")
    return value

def validate_potentiometer_value(self,value):
    if value < 0 or value > 4095:
        raise serializers.ValidationError("Potentiometer value must be withing the 0 - 4095 threshhold")
    return value


class AlertSerializer(serializers.ModelSerializer):
    class Meta:
        model = Alert
        fields = [
            "id",
            "sensor_reading",
            "severity",
            "alert_type",
            "message",
            "is_resolved",
            "created_at",
        ]
        read_only_fields = ["created_at"]


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)
    confirm_password = serializers.CharField(required=True)

    def validate(self,attrs):
        if attrs["new_password"] != attrs["confirm_password"]:
            raise serializers.ValidationError(
                {"confirm_password":"Passwords do not match."}
           )

        return attrs

class VehicleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vehicle
        fields = "__all__"
        read_only_fields = ["company"]