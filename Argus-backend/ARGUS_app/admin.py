from django.contrib import admin
from .models import *
from django.contrib.auth.admin import UserAdmin

# Register your models here.
@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):
    list_display = ("name","email","phone_number","is_active","created_at",)
    search_fields = ("name", "email",)
    list_filter = ("is_active","created_at",)
    ordering = ("name",)
    readonly_fields = ("created_at",)
    
@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = (
    "username",
    "email",
    "role",
    "company",
    "is_staff",
    "is_active",
)
    search_fields = ( "username", "email","company__name",) 
    list_filter = ("role","company","is_staff","is_active",)
    fieldsets = UserAdmin.fieldsets + (("ARGUS Information",{"fields": (
                                                                         "role",
                                                                         "company",
                                                                         "phone_number",
                                                                         )
        },
    ),
)



@admin.register(Vehicle)
class VehicleAdmin(admin.ModelAdmin):
    list_display = (
        "registration_number",
        "manufacturer",
        "model",
        'company',
        "driver",
        "status",
    )
    search_fields = ("registration_number","manufacturer","model","vin","driver__username",)
    list_filter = ("status","company","manufacturer",)
    ordering = ("registration_number",)
    readonly_fields = ("created_at",)
@admin.register(SensorReading)
class SensorReadingAdmin(admin.ModelAdmin):
    list_display = (
        "vehicle",
        "temperature",
        "vibration",
        "potentiometer_value",
        "created_at",
    )
    search_field=("vehicle__registration_number",)
    list_filter = ("vehicle","created_at",)
    ordering = ("-created_at",)
    readonly_fields = ("created_at",)
@admin.register(Alert)
class AlertAdmin(admin.ModelAdmin):
    list_display = (
        "vehicle",
        "alert_type",
        "severity",
        "is_resolved",
        "created_at",
    )

    search_fields = ("sensor_reading__vehicle__registration_number","alert_type",)
    list_filter = ( "severity", "alert_type","is_resolved", "created_at",)
    ordering = ( "-created_at",)
    readonly_fields = ( "created_at",)
       
    