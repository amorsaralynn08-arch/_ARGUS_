from django.contrib import admin
from .models import *
from django.contrib.auth.admin import UserAdmin

# Register your models here.
@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):
    list_display = ("name","email","phone_number","is_active","created_at")
    search_fields = ("name", "email")
    list_filter = ("is_active","created_at")
    ordering = ("name")
    readonly_fields = ("created_at")
    
admin.site.register(User, UserAdmin)
admin.site.register(Vehicle)
admin.site.register(SensorReading)
admin.site.register(Alert)