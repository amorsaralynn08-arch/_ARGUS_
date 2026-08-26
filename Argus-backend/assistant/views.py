from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from ARGUS_app.models import Vehicle, Alert
from .services import get_nearby_mechanics, get_ai_recommendation


class VehicleRecommendationView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, vehicle_id):
        try:
            vehicle = Vehicle.objects.get(id=vehicle_id, company=request.user.company)
        except Vehicle.DoesNotExist:
            return Response({"error": "Vehicle not found."}, status=status.HTTP_404_NOT_FOUND)

        alerts = Alert.objects.filter(sensor_reading__vehicle=vehicle).order_by("-created_at")[:5]
        nearby_shops = get_nearby_mechanics(request.user.company.address)
        recommendation = get_ai_recommendation(vehicle, alerts, nearby_shops)

        return Response({
            "recommendation": recommendation,
            "nearby_shops": nearby_shops,
        })
