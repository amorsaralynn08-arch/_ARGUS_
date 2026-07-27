
from rest_framework import viewsets,mixins
from .models import SensorReading , Alert
from .serializers import SensorReadingSerializer
from .serializers import AlertSerializer
from .permissions import CanManageAlerts , CanViewSensorReadings




# Create your views here.
class SensorReadingView(
    mixins.ListModelMixin,
    mixins.CreateModelMixin,
    mixins.RetrieveModelMixin,
    viewsets.GenericViewSet,

):
    
    queryset = SensorReading.objects.all()
    serializer_class = SensorReadingSerializer  
    permission_classes = [CanViewSensorReadings]


class AlertViewSet(
    mixins.ListModelMixin,
    mixins.CreateModelMixin,
    mixins.RetrieveModelMixin,
    viewsets.GenericViewSet,
):
    
    queryset = Alert.objects.all()
    serializer_class = AlertSerializer
    permission_classes = [CanManageAlerts]
