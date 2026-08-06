
from rest_framework import viewsets,mixins
from .models import SensorReading , Alert , Vehicle ,Company,User
from .serializers import (
    SensorReadingSerializer,
    VehicleSerializer,
    ProfileSerializer,
    AlertSerializer,
    ChangePasswordSerializer,
    RegisterSerializer,
    CompanySerializer,
)
from .permissions import CanManageAlerts , CanViewSensorReadings , CanManageVehicles , CanManageCompanies
from .utils import send_test_email,send_password_changed_email
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
    
    def get_queryset(self):
     return SensorReading.objects.filter(vehicle__company=self.request.user.company)
    serializer_class = SensorReadingSerializer  
    permission_classes = [CanViewSensorReadings]


class AlertViewSet(
    mixins.ListModelMixin,
    mixins.CreateModelMixin,
    mixins.RetrieveModelMixin,
    viewsets.GenericViewSet,
):
    
    def get_queryset(self):
     return Alert.objects.filter(sensor_reading__vehicle__company=self.request.user.company)
    serializer_class = AlertSerializer
    permission_classes = [CanManageAlerts]

class TestEmailView(APIView):
    def post(self,request):
        send_test_email(request.user.email)

        return Response({"message":"Test email sent successfully"},status=status.HTTP_200_OK)
    permission_classes = [IsAuthenticated]
    

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

            user.set_password(serializer.validated_data["new_password"])
            user.save()
            send_password_changed_email(user)
            return Response({"message":"Password changed successfully."},status=status.HTTP_200_OK,)
       
        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST,
        )

class VehicleViewSet(
    mixins.ListModelMixin,
    mixins.CreateModelMixin,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    viewsets.GenericViewSet,
):
    def get_queryset(self):
     return Vehicle.objects.filter(company=self.request.user.company)
    serializer_class = VehicleSerializer
    permission_classes = [CanManageVehicles]

    def perform_create(self, serializer):
        serializer.save(company=self.request.user.company)

class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = ProfileSerializer(request.user)
        return Response(serializer.data)

class RegisterView(APIView):

    def post(self, request):

        serializer = RegisterSerializer(data=request.data)

        if serializer.is_valid():

            user = serializer.save()

            return Response(
                {
                    "message": "Fleet Manager registered successfully.",
                    "username": user.username,
                    "email": user.email,
                },
                status=status.HTTP_201_CREATED,
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST,
        )

class CompanyViewSet(
    mixins.ListModelMixin,
    mixins.CreateModelMixin,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    viewsets.GenericViewSet,
):

    serializer_class = CompanySerializer
    permission_classes = [CanManageCompanies]

    def get_queryset(self):
        if self.request.user.role == User.Role.ADMIN:
            return Company.objects.all()

        return Company.objects.filter(id=self.request.user.company_id)

    def perform_create(self, serializer):
        company = serializer.save()

        user = self.request.user
        user.company = company
        user.save()

