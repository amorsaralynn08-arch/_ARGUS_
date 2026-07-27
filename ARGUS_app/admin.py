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
    
admin.site.register(User, UserAdmin)
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
admin.site.register(Alert)