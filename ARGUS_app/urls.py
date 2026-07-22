from django.urls import path
from .views import SensorReadingListCreateView

urlpatterns = [
    path("sensor-readings/",SensorReadingListCreateView.as_view(),name="sensor-readings"),
]