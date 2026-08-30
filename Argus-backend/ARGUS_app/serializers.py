from rest_framework import serializers
from .models import *
from django.contrib.auth.password_validation import validate_password 
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_decode
from django.utils.encoding import force_str
import re
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

    def get_vehicle(self, obj):
        v = obj.sensor_reading.vehicle
        return {
            "id": v.id,
            "registration_number": v.registration_number,
            "manufacturer": v.manufacturer,
            "model": v.model,
        }    


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

class ForgotPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField()


class ResetPasswordConfirmSerializer(serializers.Serializer):
    uidb64 = serializers.CharField()
    token = serializers.CharField()
    new_password = serializers.CharField(
        write_only=True,
        validators=[validate_password]
    )

    def validate(self, data):
        try:
            uid = force_str(
                urlsafe_base64_decode(data["uidb64"])
            )
            user = User.objects.get(pk=uid)

        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            raise serializers.ValidationError(
                {"uidb64": "Invalid reset link."}
            )

        if not default_token_generator.check_token(
            user,
            data["token"]
        ):
            raise serializers.ValidationError(
                {"token": "Invalid or expired reset link."}
            )

        data["user"] = user

        return data

class VehicleSerializer(serializers.ModelSerializer):
    driver_name = serializers.SerializerMethodField()

    class Meta:
        model = Vehicle
        fields = ["id", "registration_number", "manufacturer", "model", "year",
            "vin", "company", "driver", "driver_name", "status", "created_at"]
        read_only_fields = ["company"]

    def get_driver_name(self, obj):
        if obj.driver:
            return f"{obj.driver.first_name} {obj.driver.last_name}".strip() or obj.driver.username
        return None

    def validate_vin(self, value):
         value = value.upper().strip()

         if len(value) != 17:
            raise serializers.ValidationError(
                "VIN must be exactly 17 characters."
            )

         if not re.match(r'^[A-HJ-NPR-Z0-9]{17}$', value):
            raise serializers.ValidationError(
                "VIN contains invalid characters (real VINs never use I, O, or Q — they're too easily confused with 1 and 0)."
            )

         return value

    def validate_driver(self, value):
        """
        Ensure the assigned driver belongs to the same company
        and has the DRIVER role.
        """

        if value is None:
            return value

        request = self.context["request"]

        if value.role != User.Role.DRIVER:
            raise serializers.ValidationError(
                "The selected user is not a driver."
            )

        if value.company != request.user.company:
            raise serializers.ValidationError(
                "You can only assign drivers from your company."
            )

        return value

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "first_name",
            "last_name",
            "email",
            "role",
            "phone_number",
            "company",
            "notify_critical_email",
            "notify_warning_email",
        ]

class ProfileUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "first_name",
            "last_name",
            "phone_number",
            "notify_critical_email",
            "notify_warning_email"
            ]

        

class RegisterSerializer(serializers.ModelSerializer):
    confirm_password = serializers.CharField(
        write_only=True,
        required=True
    )

    class Meta:
        model = User
        fields = [
            "username",
            "email",
            "first_name",
            "last_name",
            "phone_number",
            "password",
            "confirm_password",
        ]

        extra_kwargs = {
            "password": {
                "write_only": True
            }
        }

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError(
                "A user with this email already exists."
            )
        return value

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError(
                "This username is already taken."
            )
        return value

    def validate(self, attrs):

        if attrs["password"] != attrs["confirm_password"]:
            raise serializers.ValidationError(
                {
                    "confirm_password": "Passwords do not match."
                }
            )

        validate_password(attrs["password"])

        return attrs

    def create(self, validated_data):

        validated_data.pop("confirm_password")

        user = User.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            first_name=validated_data["first_name"],
            last_name=validated_data["last_name"],
            phone_number=validated_data["phone_number"],
            password=validated_data["password"],
            role=User.Role.FLEET_MANAGER,
        )

        return user

class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = [
            "id",
            "name",
            "email",
            "phone_number",
            "address",
            "created_at",
            "is_active",
            "currency", 
            "unit_system",
        ]
        read_only_fields = [
            "created_at",
            "is_active",
        ]

class StaffUserSerializer(serializers.ModelSerializer):
    confirm_password = serializers.CharField(
        write_only=True,
        required=True
    )

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "email",
            "first_name",
            "last_name",
            "phone_number",
            "password",
            "confirm_password",
            "role",
        ]

        extra_kwargs = {
            "password": {
                "write_only": True
            }
        }

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError(
                "A user with this email already exists."
            )
        return value

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError(
                "This username is already taken."
            )
        return value

    def validate_role(self, value):
        allowed_roles = [
            User.Role.DRIVER,
            User.Role.MECHANIC,
        ]

        if value not in allowed_roles:
            raise serializers.ValidationError(
                "You can only create Drivers or Mechanics."
            )

        return value

    def validate(self, attrs):
        if attrs["password"] != attrs["confirm_password"]:
            raise serializers.ValidationError(
                {
                    "confirm_password": "Passwords do not match."
                }
            )

        validate_password(attrs["password"])

        return attrs

    def create(self, validated_data):
        validated_data.pop("confirm_password")

        user = User.objects.create_user(
            **validated_data
        )

        return user

class MaintenanceRecordSerializer(serializers.ModelSerializer):
    vehicle_display = serializers.SerializerMethodField()
    logged_by_name = serializers.SerializerMethodField()

    class Meta:
        model = MaintenanceRecord
        fields = [
            "id", "vehicle", "vehicle_display", "service_type",
            "description", "performed_by", "cost", "date_performed",
            "logged_by", "logged_by_name", "created_at",
        ]
        read_only_fields = ["logged_by", "created_at"]

    def get_vehicle_display(self, obj):
        return f"{obj.vehicle.manufacturer} {obj.vehicle.model} — {obj.vehicle.registration_number}"

    def get_logged_by_name(self, obj):
        return obj.logged_by.username if obj.logged_by else None

class MessageSerializer(serializers.ModelSerializer):
    sender_name = serializers.SerializerMethodField()

    class Meta:
        model = Message
        fields = ["id", "sender", "sender_name", "recipient", "content", "created_at", "is_read"]
        read_only_fields = ["sender", "created_at", "is_read"]

    def get_sender_name(self, obj):
        return obj.sender.username