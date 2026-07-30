
from rest_framework import viewsets,mixins
from .models import SensorReading , Alert
from .serializers import SensorReadingSerializer
from .serializers import AlertSerializer, ChangePasswordSerializer
from .permissions import CanManageAlerts , CanViewSensorReadings
from .utils import send_test_email
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

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

class TestEmailView(APIView):
    def post(self,request):
        send_test_email(request.user.email)

        return Response({"message":"Test email sent successfully"},status=status.HTTP_200_OK)

class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self , request):
        serializer = ChangePasswordSerializer(data=request.data)

        if serializer.is_valid():
            user = request.user

        if not user.check_password(
            serializer.validated_data["old_password"]
        ):
            return Response({
                "old_password":"Incorrect password."},
                status=status.HTTP_400_BAD_REQUEST,)