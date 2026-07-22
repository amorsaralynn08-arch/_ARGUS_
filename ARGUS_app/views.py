from django.shortcuts import render
from rest_framework import generics
from rest_framework import viewsets
from .models import *
from .serializers import SensorReadingSerializer
from .serializers import AlertSerializer


# Create your views here.
class SensorReadingListCreateView(generics.ListCreateAPIView):
    queryset = SensorReading.objects.all()
    serializer_class = SensorReadingSerializer  

class AlertViewSet(viewsets.ModelViewSet):
    queryset = Alert.objects.all()
    serializer_class = AlertSerializer