from django.db import models

# Create your models here.

class Company(models.Model):
    name = models.CharField(max_length=30 , unique=True)
    email = models.EmailField(unique=True)
    phone_number = models.CharField(max_length=20)
    address = models.CharField()
    created_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)


    def __str__(self):
        return self.name
