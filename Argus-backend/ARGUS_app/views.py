
from rest_framework import viewsets,mixins
from rest_framework.pagination import PageNumberPagination
from rest_framework.exceptions import PermissionDenied
from .models import MaintenanceRecord, SensorReading , Alert , Vehicle ,Company,User,Message
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
    MaintenanceRecordSerializer,
    MessageSerializer,
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
from django.db.models import Q

# Create your views here.
class SensorReadingView(
    mixins.ListModelMixin,
    mixins.CreateModelMixin,
    mixins.RetrieveModelMixin,
    viewsets.GenericViewSet,

):
    
    def get_queryset(self):
        user = self.request.user
        qs = SensorReading.objects.filter(vehicle__company=user.company)
        if user.role == User.Role.DRIVER:
            qs = qs.filter(vehicle__driver=user)
        return qs
     
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
        user = self.request.user
        qs = Alert.objects.filter(sensor_reading__vehicle__company=user.company)
        if user.role == User.Role.DRIVER:
            qs = qs.filter(sensor_reading__vehicle__driver=user)
        return qs
    
    permission_classes = [CanManageAlerts]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ["sensor_reading__vehicle","is_resolved"]

    
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
        user = self.request.user
        qs = Vehicle.objects.filter(company=user.company)
        if user.role == User.Role.DRIVER:
            qs = qs.filter(driver=user)
        return qs
     
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
class MaintenanceRecordViewSet(
    mixins.ListModelMixin,
    mixins.CreateModelMixin,
    mixins.RetrieveModelMixin,
    viewsets.GenericViewSet,
):
    serializer_class = MaintenanceRecordSerializer
    permission_classes = [IsAuthenticated]  # tighten to a real permission class once you have one for this
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ["vehicle"]
    pagination_class = None  # uses your project default if set, otherwise flag this — we discussed this gap before

    def get_queryset(self):
     return MaintenanceRecord.objects.filter(vehicle__company=self.request.user.company)

    def perform_create(self, serializer):
        serializer.save(logged_by=self.request.user)

    from rest_framework.pagination import PageNumberPagination

class MaintenancePagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = "page_size"
    max_page_size = 50


class MaintenanceRecordViewSet(
    mixins.ListModelMixin,
    mixins.CreateModelMixin,
    mixins.RetrieveModelMixin,
    viewsets.GenericViewSet,
):
    serializer_class = MaintenanceRecordSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ["vehicle"]
    pagination_class = MaintenancePagination

    def get_queryset(self):
        user = self.request.user
        qs = MaintenanceRecord.objects.filter(vehicle__company=user.company)
        if user.role == User.Role.DRIVER:
            qs = qs.filter(vehicle__driver=user)
        return qs

    def perform_create(self, serializer):
        if self.request.user.role == User.Role.DRIVER:
            raise PermissionDenied("Drivers cannot log maintenance records.")
        serializer.save(logged_by=self.request.user)



class MessageContactsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        if user.role == User.Role.FLEET_MANAGER:
            contacts = User.objects.filter(company=user.company).exclude(id=user.id).exclude(role=User.Role.FLEET_MANAGER)
        else:
            contacts = User.objects.filter(company=user.company, role=User.Role.FLEET_MANAGER)

        data = [
            {"id": c.id, "name": f"{c.first_name} {c.last_name}".strip() or c.username, "role": c.role}
            for c in contacts
        ]
        return Response(data)


class MessageListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        other_id = request.query_params.get("with")
        if not other_id:
            return Response({"error": "with parameter required"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            other = User.objects.get(id=other_id, company=request.user.company)
        except User.DoesNotExist:
            return Response({"error": "User not found in your company."}, status=status.HTTP_404_NOT_FOUND)

        messages = Message.objects.filter(
            Q(sender=request.user, recipient=other) | Q(sender=other, recipient=request.user)
        )
        Message.objects.filter(sender=other, recipient=request.user, is_read=False).update(is_read=True)
        return Response(MessageSerializer(messages, many=True).data)

    def post(self, request):
        content = request.data.get("content", "").strip()
        if not content:
            return Response({"error": "Message cannot be empty."}, status=status.HTTP_400_BAD_REQUEST)
        try:
            recipient = User.objects.get(id=request.data.get("recipient"), company=request.user.company)
        except User.DoesNotExist:
            return Response({"error": "Recipient not found in your company."}, status=status.HTTP_404_NOT_FOUND)

        message = Message.objects.create(sender=request.user, recipient=recipient, content=content)
        return Response(MessageSerializer(message).data, status=status.HTTP_201_CREATED)


class UnreadMessageCountView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        count = Message.objects.filter(recipient=request.user, is_read=False).count()
        return Response({"count": count})

class MessageContactsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        if user.role == User.Role.FLEET_MANAGER:
            contacts = User.objects.filter(company=user.company).exclude(id=user.id).exclude(role=User.Role.FLEET_MANAGER)
        else:
            contacts = User.objects.filter(company=user.company, role=User.Role.FLEET_MANAGER)

        data = []
        for c in contacts:
            unread = Message.objects.filter(sender=c, recipient=user, is_read=False).count()
            data.append({
                "id": c.id,
                "name": f"{c.first_name} {c.last_name}".strip() or c.username,
                "role": c.role,
                "unread_count": unread,
            })
        return Response(data)

class VehicleRecommendationView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, vehicle_id):
        try:
            vehicle = Vehicle.objects.get(id=vehicle_id, company=request.user.company)
            if request.user.role == User.Role.DRIVER and vehicle.driver_id != request.user.id:
                return Response({"error": "Vehicle not found."}, status=status.HTTP_404_NOT_FOUND)
        except Vehicle.DoesNotExist:
            return Response({"error": "Vehicle not found."}, status=status.HTTP_404_NOT_FOUND)
        