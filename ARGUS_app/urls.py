from django.urls import path , include
from .views import SensorReadingListCreateView,AlertViewSet
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (TokenObtainPairView , TokenRefreshView)


router = DefaultRouter()
router.register("alerts" ,AlertViewSet)

urlpatterns = [
    path("sensor-readings/",SensorReadingListCreateView.as_view(),name="sensor-readings"),
    path("", include(router.urls)),
    path("token/",TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
]
