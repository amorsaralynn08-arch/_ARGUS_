from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.

class Company(models.Model):
    name = models.CharField(max_length=30 , unique=True)
    email = models.EmailField(unique=True)
    phone_number = models.CharField(max_length=20)
    address = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)

    class Currency(models.TextChoices):
     KES = "KES", "Kenyan Shilling"
     USD = "USD", "US Dollar"

    class UnitSystem(models.TextChoices):
     KM = "KM", "Kilometers"
     MILES = "MILES", "Miles"

    currency = models.CharField(max_length=3, choices=Currency.choices, default=Currency.KES)
    unit_system = models.CharField(max_length=10, choices=UnitSystem.choices, default=UnitSystem.KM)

    class Meta:
        ordering = ["name"]


    def __str__(self):
        return self.name

class User(AbstractUser):
    
    class Role(models.TextChoices):
        ADMIN = "ADMIN" , "Platform Admin"
        FLEET_MANAGER = "FLEET_MANAGER" , "Fleet Manager"
        DRIVER = "DRIVER" , "Driver"
        MECHANIC = "MECHANIC" , "Mechanic"

    role=models.CharField(max_length=20,
                        choices=Role.choices,
                        default=Role.FLEET_MANAGER,
                              )
    phone_number = models.CharField(max_length=20)
    company=models.ForeignKey(Company,
                              on_delete=models.CASCADE,
                              related_name= "users",
                              null=True,
                              blank=True,

                              )
    created_at=models.DateTimeField(auto_now_add=True)
    notify_critical_email = models.BooleanField(default=True)
    notify_warning_email = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.username} ({self.role})"
    
class Vehicle(models.Model):
    registration_number=models.CharField(max_length=20,unique=True)
    manufacturer = models.CharField(max_length=50)
    model=models.CharField(max_length=50)
    year = models.PositiveIntegerField()
    vin = models.CharField(max_length=17,unique=True)
    company = models.ForeignKey(Company,on_delete=models.CASCADE,related_name="vehicles")
    driver = models.ForeignKey(User,
                               on_delete=models.SET_NULL,
                               null=True,
                               blank=True,
                               related_name="vehicles"
                               )
    class Status(models.TextChoices):
        ACTIVE = "ACTIVE" , "Active"
        MAINTENANCE = "MAINTENANCE" , "Maintenance"
        OFFLINE = "OFFLINE" , "Offline"
        CRITICAL = "CRITICAL" , "Critical"

    status = models.CharField(max_length=20,
                              choices=Status.choices,
                              default=Status.ACTIVE
    )
    created_at=models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.registration_number


class SensorReading(models.Model):
    vehicle = models.ForeignKey(Vehicle,
                                on_delete=models.CASCADE,
                                related_name="sensor_readings"
                                )
    temperature = models.FloatField()
    vibration = models.FloatField()
    potentiometer_value=models.IntegerField()
    health_score = models.FloatField()
    health_status = models.CharField(max_length=20, choices=Vehicle.Status.choices)

    created_at = models.DateTimeField(auto_now_add=True,db_index=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.vehicle.registration_number} -- {self.created_at}"

class Alert(models.Model):

    class AlertType(models.TextChoices):
        HIGH_TEMPERATURE = "HIGH_TEMPERATURE" , "High Temperature"
        HIGH_VIBRATION = "HIGH_VIBRATION" , "High Vibration"
        LOW_HEALTH_SCORE = "LOW_HEALTH_SCORE" , "Low Health Score"

    class Severity(models.TextChoices):
        WARNING = "WARNING" , "Warning"
        CRITICAL= "CRITICAL" , "Critical"
        NORMAL="NORMAL","Normal"

    
    sensor_reading = models.ForeignKey(
        SensorReading,
        on_delete=models.CASCADE,
        related_name="alerts"
    )
    severity = models.CharField(
    max_length=20,
    choices=Severity.choices
                           )
    alert_type = models.CharField(max_length=50 , choices=AlertType.choices)
    message = models.TextField()
    is_resolved = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    @property
    def vehicle(self):
        return self.sensor_reading.vehicle
    
    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.vehicle.registration_number} -- {self.alert_type}"

class MaintenanceRecord(models.Model):
     vehicle = models.ForeignKey(
        Vehicle,
        on_delete=models.CASCADE,
        related_name="maintenance_records"
    )
     service_type = models.CharField(max_length=100)
     description = models.TextField()
     performed_by = models.CharField(max_length=100)
     cost = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
     date_performed = models.DateField()
     logged_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        related_name="logged_maintenance"
    )
     created_at = models.DateTimeField(auto_now_add=True)

class Meta:
        ordering = ["-date_performed"]

def __str__(self):
        return f"{self.vehicle.registration_number} — {self.service_type} ({self.date_performed})"