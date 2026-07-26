
from rest_framework import generics
from rest_framework import viewsets
from .models import *
from .serializers import SensorReadingSerializer
from .serializers import AlertSerializer
from .permissions import IsAdminOrFleetManager




# Create your views here.
class SensorReadingListCreateView(generics.ListCreateAPIView):
    queryset = SensorReading.objects.all()
    serializer_class = SensorReadingSerializer  
    permission_classes = [IsAdminOrFleetManager]


class AlertViewSet(viewsets.ModelViewSet):
    queryset = Alert.objects.all()
    serializer_class = AlertSerializer