from django.urls import path , include
from .views import (
    MaintenanceRecordViewSet,
    SensorReadingView,
    AlertViewSet,
    TestEmailView,
    ChangePasswordView,
    VehicleViewSet,
    ProfileView,
    RegisterView,
    CompanyViewSet,
    UserViewSet,
    ForgotPasswordView,
    ResetPasswordConfirmView,

)
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (TokenObtainPairView , TokenRefreshView)



router = DefaultRouter()
router.register(r"alerts" , AlertViewSet , basename="alert",)
router.register(r"sensor-readings",SensorReadingView,basename="sensor-reading")
router.register(r"vehicles",VehicleViewSet,basename="vehicle",)
router.register(r"companies", CompanyViewSet, basename="company")
router.register(r"users",UserViewSet,basename="user")
router.register(r"maintenance", MaintenanceRecordViewSet, basename="maintenance")

urlpatterns = [
    
    path("", include(router.urls)),
    path("test-email/", TestEmailView.as_view(), name="test-email"),
    path("password-reset/",ForgotPasswordView.as_view(),name="password-reset",),
    path("password-reset/confirm/",ResetPasswordConfirmView.as_view(),name="password-reset-confirm",),
    path("change-password/",ChangePasswordView.as_view(),name="change-password",),
    path("profile/", ProfileView.as_view(), name="profile"),
    path("register/", RegisterView.as_view(), name="register"),
    path("token/",TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),

]

