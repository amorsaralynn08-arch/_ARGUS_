from rest_framework.permissions import BasePermission
from .models import User

class CanViewSensorReadings(BasePermission):
    ALLOWED_ROLES=(
        User.Role.ADMIN,
        User.Role.FLEET_MANAGER,
        User.Role.DRIVER,
        User.Role.MECHANIC,
    )

    def has_permission(self, request, view):
        return (
            request.user.is_authenticated and request.user.role in self.ALLOWED_ROLES
        )

class CanManageAlerts(BasePermission):
    ALLOWED_ROLES = (
        User.Role.ADMIN,
        User.Role.FLEET_MANAGER,

    )

    def has_permission(self, request, view):
        return (
            request.user.is_authenticated and 
            request.user.role in self.ALLOWED_ROLES
        )

class CanManageVehicles(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.role == User.Role.FLEET_MANAGER
        )