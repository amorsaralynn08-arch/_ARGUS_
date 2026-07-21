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
                              )
    created_at=models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.username} ({self.role})"

