"""
Health scoring logic for incoming sensor readings.


"""

from .models import Alert


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


def create_alerts_for_reading(sensor_reading, statuses, score):
    """Creates one Alert per metric that tripped a threshold."""
    created = []

    if statuses["temperature"] != "NORMAL":
        created.append(Alert.objects.create(
            sensor_reading=sensor_reading,
            severity=statuses["temperature"],
            alert_type=Alert.AlertType.HIGH_TEMPERATURE,
            message=f"High temperature reading for {sensor_reading.vehicle.registration_number}.",
        ))

    if statuses["vibration"] != "NORMAL":
        created.append(Alert.objects.create(
            sensor_reading=sensor_reading,
            severity=statuses["vibration"],
            alert_type=Alert.AlertType.HIGH_VIBRATION,
            message=f"High vibration reading for {sensor_reading.vehicle.registration_number}.",
        ))

    if statuses["potentiometer"] != "NORMAL" and score < SCORE_ALERT_THRESHOLD:
        created.append(Alert.objects.create(
            sensor_reading=sensor_reading,
            severity=statuses["potentiometer"],
            alert_type=Alert.AlertType.LOW_HEALTH_SCORE,
            message=f"Overall health score dropped for {sensor_reading.vehicle.registration_number}.",
        ))

    return created