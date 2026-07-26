
from rest_framework import viewsets,mixins
from .models import SensorReading , Alert
from .serializers import SensorReadingSerializer
from .serializers import AlertSerializer
from .permissions import IsAdminOrFleetManager




# Create your views here.
class SensorReadingView(
    mixins.ListModelMixin,
    mixins.CreateModelMixin,
    mixins.RetrieveModelMixin,
    viewsets.GenericViewSet,

):
    
    queryset = SensorReading.objects.all()
    serializer_class = SensorReadingSerializer  
    permission_classes = [IsAdminOrFleetManager]


class AlertViewSet(viewsets.ModelViewSet):
    queryset = Alert.objects.all()
    serializer_class = AlertSerializer
    permission_classes = [IsAdminOrFleetManager]
