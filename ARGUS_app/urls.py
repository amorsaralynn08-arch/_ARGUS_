from django.urls import path , include
from .views import SensorReadingView,AlertViewSet,TestEmailView
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (TokenObtainPairView , TokenRefreshView)
from django.contrib.auth.views import (PasswordResetView,PasswordResetDoneView,PasswordResetConfirmView,PasswordResetCompleteView)


router = DefaultRouter()
router.register(r"alerts" , AlertViewSet , basename="alert",)
router.register(r"sensor-readings",SensorReadingView,basename="sensor-reading")


urlpatterns = [
    
    path("", include(router.urls)),
    path("token/",TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("test-email/", TestEmailView.as_view(), name="test-email"),
    path("password-reset/",PasswordResetView.as_view(),name="password-reset"),
    path("password-reset/done/",PasswordResetDoneView.as_view(),name="password_reset_done",),
    path("reset/<uidb64>/<token>/",PasswordResetConfirmView.as_view(),name="password_reset_confirm",),
    path("reset/done/",PasswordResetCompleteView.as_view(),name="password_reset_complete",),



]

