from rest_framework.permissions import BasePermission, SAFE_METHODS
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
        if not request.user.is_authenticated:
            return False
        if request.user.role in self.ALLOWED_ROLES:
            return True
        # Drivers can view alerts (scoped to their own vehicle by the
        # queryset), but never create/edit/resolve them.
        if request.user.role == User.Role.DRIVER and request.method in SAFE_METHODS:
            return True
        return False

class CanManageVehicles(BasePermission):
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        if request.user.role == User.Role.FLEET_MANAGER:
            return True
        # Drivers can view vehicles (scoped to their own by the
        # queryset), but never create/edit/delete them.
        if request.user.role == User.Role.DRIVER and request.method in SAFE_METHODS:
            return True
        return False

class CanManageCompanies(BasePermission):
    """
    Allows Platform Admins and Fleet Managers
    to manage companies.
    """

    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.role in [
                User.Role.ADMIN,
                User.Role.FLEET_MANAGER,
            ]
        )

class CanManageUsers(BasePermission):
    """
    Allows Platform Admins and Fleet Managers
    to create and manage users.
    """

    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.role in [
                User.Role.ADMIN,
                User.Role.FLEET_MANAGER,
            ]
        )