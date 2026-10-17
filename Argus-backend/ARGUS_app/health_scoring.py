"""
Health scoring logic for incoming sensor readings.
"""

from .models import Alert, Vehicle


TEMPERATURE_WARNING = 70     # °C
TEMPERATURE_CRITICAL = 90    # °C

VIBRATION_WARNING = 3.0      # placeholder scale
VIBRATION_CRITICAL = 7.0

POTENTIOMETER_WARNING = 2500     # out of 0-4095
POTENTIOMETER_CRITICAL = 3500

SCORE_ALERT_THRESHOLD = 70   # below this, a "low health score" alert can fire


def _status_for_metric(value, warning, critical):
    if value >= critical:
        return "CRITICAL"
    elif value >= warning:
        return "WARNING"
    return "NORMAL"


def compute_health(temperature, vibration, potentiometer_value):
    """Returns (score: 0-100, overall_status: str, per-metric statuses: dict)"""
    statuses = {
        "temperature": _status_for_metric(temperature, TEMPERATURE_WARNING, TEMPERATURE_CRITICAL),
        "vibration": _status_for_metric(vibration, VIBRATION_WARNING, VIBRATION_CRITICAL),
        "potentiometer": _status_for_metric(potentiometer_value, POTENTIOMETER_WARNING, POTENTIOMETER_CRITICAL),
    }

    if "CRITICAL" in statuses.values():
        overall_status = "CRITICAL"
    elif "WARNING" in statuses.values():
        overall_status = "WARNING"
    else:
        overall_status = "NORMAL"

    penalty = {"NORMAL": 0, "WARNING": 15, "CRITICAL": 35}
    score = max(0, min(100, 100 - sum(penalty[s] for s in statuses.values())))

    return score, overall_status, statuses


def _open_alert_exists(vehicle, alert_type, severity):
    """True if this vehicle already has an unresolved alert of the same kind and severity."""
    return Alert.objects.filter(
        sensor_reading__vehicle=vehicle,
        alert_type=alert_type,
        severity=severity,
        is_resolved=False,
    ).exists()


def _create_alert_once(sensor_reading, alert_type, severity, message):
    """Creates the alert only if the same one isn't already open."""
    if _open_alert_exists(sensor_reading.vehicle, alert_type, severity):
        return None
    return Alert.objects.create(
        sensor_reading=sensor_reading,
        severity=severity,
        alert_type=alert_type,
        message=message,
    )


def create_alerts_for_reading(sensor_reading, statuses, score):
    """Creates one Alert per metric that tripped a threshold (no duplicates)."""
    created = []
    plate = sensor_reading.vehicle.registration_number

    if statuses["temperature"] != "NORMAL":
        alert = _create_alert_once(
            sensor_reading,
            Alert.AlertType.HIGH_TEMPERATURE,
            statuses["temperature"],
            f"High temperature reading for {plate}.",
        )
        if alert:
            created.append(alert)

    if statuses["vibration"] != "NORMAL":
        alert = _create_alert_once(
            sensor_reading,
            Alert.AlertType.HIGH_VIBRATION,
            statuses["vibration"],
            f"High vibration reading for {plate}.",
        )
        if alert:
            created.append(alert)

            
    if statuses["potentiometer"] != "NORMAL":
        alert = _create_alert_once(
            sensor_reading,
            Alert.AlertType.LOW_HEALTH_SCORE,
            statuses["potentiometer"],
            f"Health score dropped to {score:.0f} for {plate}.",
        )
        if alert:
            created.append(alert)

    return created


def update_vehicle_status(vehicle, overall_status):
    """Flips the vehicle to CRITICAL on a critical reading, and back to ACTIVE when it recovers."""
    if vehicle.status == Vehicle.Status.MAINTENANCE:
        return  # a vehicle in the workshop stays in the workshop

    if overall_status == "CRITICAL":
        new_status = Vehicle.Status.CRITICAL
    elif overall_status == "WARNING":
        new_status = Vehicle.Status.WARNING
    else:
        new_status = Vehicle.Status.ACTIVE

    if vehicle.status != new_status:
        vehicle.status = new_status
        vehicle.save(update_fields=["status"])