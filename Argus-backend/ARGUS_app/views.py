
from rest_framework import viewsets,mixins
from .models import SensorReading , Alert , Vehicle ,Company,User
from .serializers import (
    ProfileUpdateSerializer,
    SensorReadingSerializer,
    VehicleSerializer,
    ProfileSerializer,
    AlertSerializer,
    ChangePasswordSerializer,
    RegisterSerializer,
    CompanySerializer,
    StaffUserSerializer,
    ForgotPasswordSerializer,
    ResetPasswordConfirmSerializer,
)
from .permissions import CanManageAlerts , CanViewSensorReadings , CanManageVehicles , CanManageCompanies , CanManageUsers
from .utils import send_test_email,send_password_changed_email,send_password_reset_email,send_password_reset_success_email
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.conf import settings

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
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ["vehicle"]

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
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ["sensor_reading__vehicle"]

    
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
    filter_backends = [DjangoFilterBackend,SearchFilter,OrderingFilter,]
    filterset_fields = ["status","manufacturer",]
    search_fields = ["registration_number","manufacturer","model","vin",]
    ordering_fields = ["created_at","year",]
      
    def perform_create(self, serializer):
        serializer.save(company=self.request.user.company)

class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = ProfileSerializer(request.user)
        return Response(serializer.data)

    def patch(self, request):
        serializer = ProfileUpdateSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(ProfileSerializer(request.user).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

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

class UserViewSet(
    mixins.ListModelMixin,
    mixins.CreateModelMixin,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    viewsets.GenericViewSet,
):

    serializer_class = StaffUserSerializer
    permission_classes = [CanManageUsers]

    def get_queryset(self):

        if self.request.user.role == User.Role.ADMIN:
            return User.objects.all()

        return User.objects.filter(
            company=self.request.user.company
        )

    def perform_create(self, serializer):

        serializer.save(
            company=self.request.user.company
        )

class ForgotPasswordView(APIView):
    permission_classes = []

    def post(self, request):

        serializer = ForgotPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data["email"]

        try:
            user = User.objects.get(email=email)

            uidb64 = urlsafe_base64_encode(
                force_bytes(user.pk)
            )

            token = default_token_generator.make_token(user)

            reset_link = (
                f"{settings.FRONTEND_URL}"
                f"/reset-password/{uidb64}/{token}/"
            )

            send_password_reset_email(
                user,
                reset_link
            )

        except User.DoesNotExist:
            pass

        return Response(
            {
                "message": (
                    "If an account with that email exists, "
                    "a reset link has been sent."
                )
            },
            status=status.HTTP_200_OK,
        )

class ResetPasswordConfirmView(APIView):
    permission_classes = []

    def post(self, request):

        serializer = ResetPasswordConfirmSerializer(
            data=request.data
        )

        serializer.is_valid(raise_exception=True)

        user = serializer.validated_data["user"]

        user.set_password(
            serializer.validated_data["new_password"]
        )

        user.save()

        send_password_reset_success_email(user)

        return Response(
            {
                "message": "Password reset successful."
            },
            status=status.HTTP_200_OK,
        )