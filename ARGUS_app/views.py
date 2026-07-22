from django.shortcuts import render
from rest_framework import generics
from .models import SensorReading
from .serializers import SensorReadingSerializer

# Create your views here.
class SensorReadingListCreateView(generics.ListCreateAPIView):
    queryset = SensorReading.objects.all()
    serializer_class = SensorReadingSerializer  