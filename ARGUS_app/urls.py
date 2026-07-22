from django.urls import path , include
from .views import SensorReadingListCreateView,AlertViewSet
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register("alerts" ,AlertViewSet)

urlpatterns = [
    path("sensor-readings/",SensorReadingListCreateView.as_view(),name="sensor-readings"),
    path("", include(router.urls)),
]
