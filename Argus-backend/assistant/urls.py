from django.urls import path
from .views import VehicleRecommendationView

urlpatterns = [
    path("recommend/<int:vehicle_id>/", VehicleRecommendationView.as_view(), name="vehicle-recommend"),
]