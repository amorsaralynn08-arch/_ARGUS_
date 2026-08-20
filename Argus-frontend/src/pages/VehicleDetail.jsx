import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { ArrowLeft } from "lucide-react";

const statusStyles = {
  ACTIVE: { label: "Normal", color: "var(--color-success)" },
  MAINTENANCE: { label: "Maintenance", color: "var(--color-warning)" },
  CRITICAL: { label: "Critical", color: "var(--color-danger)" },
  OFFLINE: { label: "Offline", color: "var(--color-text-secondary)" },
};

const VehicleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState(null);
  const [readings, setReadings] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);


   useEffect(() => {
    const load = async () => {
    setLoading(true);

    try {
      const { data } = await api.get(`vehicles/${id}/`);
      setVehicle(data);
    } catch (err) {
      console.error("Failed to load vehicle:", err.response?.status, err.response?.data);
      setLoading(false);
      return;
    }

    try {
      const { data } = await api.get(`sensor-readings/?vehicle=${id}`);
      setReadings(Array.isArray(data) ? data : data.results || []);
    } catch (err) {
      console.error("Failed to load readings:", err.response?.status, err.response?.data);
    }

    try {
      const { data } = await api.get(`alerts/?sensor_reading__vehicle=${id}`);
      setAlerts(Array.isArray(data) ? data : data.results || []);
    } catch (err) {
      console.error("Failed to load alerts:", err.response?.status, err.response?.data);
    }

    setLoading(false);
  };

  load();
}, [id]);

  if (loading) return <div>Loading...</div>;
  if (!vehicle) return <div>Vehicle not found.</div>;

  const s = statusStyles[vehicle.status] || statusStyles.ACTIVE;
  const latestReading = readings[0];

  return (
    <div>
      <button className="back-link" onClick={() => navigate("/dashboard")}>
        <ArrowLeft size={15} /> Back to Vehicles
      </button>

      <div className="detail-header">
        <div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.3rem", marginBottom: "4px" }}>
            {vehicle.manufacturer} {vehicle.model}
          </h1>
          <div style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>{vehicle.registration_number}</div>
        </div>
        <div className="status-badge" style={{ color: s.color, borderColor: s.color }}>{s.label}</div>
      </div>

      <div className="detail-info-grid">
        <div><span>Year</span><div>{vehicle.year}</div></div>
        <div><span>VIN</span><div>{vehicle.vin}</div></div>
        <div><span>Driver</span><div>{vehicle.driver_name || "Unassigned"}</div></div>
      </div>

      <h2 className="section-title">Recent readings</h2>
      {latestReading ? (
        <div className="reading-grid">
          <div><span>Temperature</span><div>{latestReading.temperature}°C</div></div>
          <div><span>Vibration</span><div>{latestReading.vibration}</div></div>
          <div><span>Potentiometer</span><div>{latestReading.potentiometer_value}</div></div>
        </div>
      ) : (
        <div className="table-empty">No sensor readings yet.</div>
      )}

      <h2 className="section-title">Alerts</h2>
      {alerts.length === 0 ? (
        <div className="table-empty">No alerts for this vehicle.</div>
      ) : (
        <div className="vehicle-table">
          {alerts.map((a) => (
            <div className="table-row" key={a.id} style={{ gridTemplateColumns: "1fr 2fr 1fr" }}>
              <div style={{ color: a.severity === "CRITICAL" ? "var(--color-danger)" : "var(--color-warning)" }}>{a.severity}</div>
              <div>{a.message}</div>
              <div style={{ color: "var(--color-text-secondary)", fontSize: 12 }}>{new Date(a.created_at).toLocaleString()}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VehicleDetail;