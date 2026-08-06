from django.urls import path , include
from .views import (
    SensorReadingView,
    AlertViewSet,
    TestEmailView,
    ChangePasswordView,
    VehicleViewSet,
    ProfileView,
    RegisterView,
    CompanyViewSet,
)
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (TokenObtainPairView , TokenRefreshView)
from django.contrib.auth.views import (PasswordResetView,PasswordResetDoneView,PasswordResetConfirmView,PasswordResetCompleteView )


router = DefaultRouter()
router.register(r"alerts" , AlertViewSet , basename="alert",)
router.register(r"sensor-readings",SensorReadingView,basename="sensor-reading")
router.register(r"vehicles",VehicleViewSet,basename="vehicle",)
router.register(r"companies", CompanyViewSet, basename="company")


urlpatterns = [
    
    path("", include(router.urls)),
    path("test-email/", TestEmailView.as_view(), name="test-email"),
    path("password-reset/",PasswordResetView.as_view(),name="password-reset"),
    path("password-reset/done/",PasswordResetDoneView.as_view(),name="password_reset_done",),
    path("reset/<uidb64>/<token>/",PasswordResetConfirmView.as_view(),name="password_reset_confirm",),
    path("reset/done/",PasswordResetCompleteView.as_view(),name="password_reset_complete",),
    path("change-password/",ChangePasswordView.as_view(),name="change-password",),
    path("profile/", ProfileView.as_view(), name="profile"),
    path("register/", RegisterView.as_view(), name="register"),
    path("token/",TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),



]

