from rest_framework.permissions import BasePermission
from .models import User

class isAdminorFleetManager(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated and request.user.role in [User.ADMIN , User.FLEET_MANAGER]
        )