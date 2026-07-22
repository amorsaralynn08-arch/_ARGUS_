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

    def __str__(self):
        return f"{self.username} ({self.role})"
    
class Vehicle(models.Model):
    registration_number=models.CharField(max_length=20,unique=True)
    manufacturer = models.CharField(max_length=20)
    model=models.CharField(max_length=20)
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
    
    created_at = models.DateTimeField(auto_now_add=True)

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

    
    sensor_reading = models.ForeignKey(
        SensorReading,
        on_delete=models.CASCADE,
        related_name="alerts"
    )
    severity = models.CharField(
    max_length=20,
    choices=Severity.choices
                           )
    alert_type = models.CharField(max_length=30 , choices=AlertType.choices)
    message = models.TextField()
    is_resolved = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.vehicle.registration_number} -- {self.alert_type}"