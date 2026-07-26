from django.urls import path , include
from .views import SensorReadingView,AlertViewSet
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (TokenObtainPairView , TokenRefreshView)


router = DefaultRouter()
router.register(r"alerts" , AlertViewSet , basename="alert",)
router.register(r"sensor-readings",SensorReadingView,basename="sensor-reading")


urlpatterns = [
    
    path("", include(router.urls)),
    path("token/",TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    
]
