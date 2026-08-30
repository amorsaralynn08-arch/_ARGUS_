import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { ArrowLeft, Sparkles, AlertTriangle } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getHomeRouteForRole } from "../utils/roleRoutes";
import Modal from "../components/Modal";


const statusStyles = {
  ACTIVE: { label: "Normal", color: "var(--color-success)" },
  MAINTENANCE: { label: "Maintenance", color: "var(--color-warning)" },
  CRITICAL: { label: "Critical", color: "var(--color-danger)" },
  OFFLINE: { label: "Offline", color: "var(--color-text-secondary)" },
};

const VehicleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isDriver = user?.role === "DRIVER";
  const isFleetManager = user?.role === "FLEET_MANAGER";

  const [vehicle, setVehicle] = useState(null);
  const [readings, setReadings] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recommendation, setRecommendation] = useState(null);
  const [nearbyShops, setNearbyShops] = useState([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState(null);
  const [drivers, setDrivers] = useState([]);
const [showAssignModal, setShowAssignModal] = useState(false);
const [selectedDriverId, setSelectedDriverId] = useState("");
const [assigningDriver, setAssigningDriver] = useState(false);
const [assignError, setAssignError] = useState(null);

  const handleGetRecommendation = async () => {
    setAiLoading(true);
    setAiError(null);
    try {
      const { data } = await api.get(`assistant/recommend/${id}/`);
      setRecommendation(data.recommendation);
      setNearbyShops(data.nearby_shops);
    } catch (err) {
      setAiError("Sorry, something went wrong. Please try again later.");
    } finally {
      setAiLoading(false);
    }
  };

const openAssignModal = () => {
  setSelectedDriverId(vehicle.driver || "");
  setAssignError(null);
  setShowAssignModal(true);
};

const handleConfirmAssign = async () => {
  setAssigningDriver(true);
  setAssignError(null);
  try {
    const { data } = await api.patch(`vehicles/${id}/`, { driver: selectedDriverId ? Number(selectedDriverId) : null });
    setVehicle(data);
    setShowAssignModal(false);
  } catch (err) {
    console.error("Assign driver error:", err.response?.data);
    setAssignError("Couldn't assign this driver. Please try again, or pick a different one.");
  } finally {
    setAssigningDriver(false);
  }
};
  
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

  useEffect(() => {
    if (isFleetManager) {
      api.get("users/").then(({ data }) => {
        const list = Array.isArray(data) ? data : data.results || [];
        setDrivers(list.filter((u) => u.role === "DRIVER"));
      });
    }
  }, [isFleetManager]);

  // Early returns now happen AFTER every hook has run
  if (loading) return <div>Loading...</div>;
  if (!vehicle) return <div>Vehicle not found.</div>;

  const s = statusStyles[vehicle.status] || statusStyles.ACTIVE;
  const latestReading = readings[0];

  return (
    <div>
      <button className="back-link" onClick={() => navigate(getHomeRouteForRole(user?.role))}>
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

      {isDriver && (
        <button
          className="add-btn"
          style={{ background: "var(--color-danger)", marginTop: 12 }}
          onClick={() => navigate("/driver/messages", { state: { prefill: `Reporting an issue with ${vehicle.manufacturer} ${vehicle.model} (${vehicle.registration_number}): ` } })}
        >
          <AlertTriangle size={15} /> Report an Issue
        </button>
      )}

      <div className="detail-info-grid">
        <div><span>Year</span><div>{vehicle.year}</div></div>
        <div><span>VIN</span><div>{vehicle.vin}</div></div>
        <div>
       <span>Driver</span>
       <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
       <div>{vehicle.driver_name || "Unassigned"}</div>
       {isFleetManager && (
      <button className="link-btn" onClick={openAssignModal}>Change</button>
       )}
      </div>
      </div>
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

      <h2 className="section-title">AI Recommendation</h2>

      {!recommendation && !aiLoading && (
        <button className="add-btn" onClick={handleGetRecommendation}>
          <Sparkles size={15} /> Get Recommendation
        </button>
      )}

      {aiLoading && <div className="table-empty">Thinking...</div>}

      {aiError && <p className="form-error">{aiError}</p>}

      {recommendation && (
        <div className="recommendation-box">
          <p>{recommendation}</p>

          {nearbyShops.length > 0 && (
            <>
              <div className="settings-label" style={{ marginTop: 16, marginBottom: 8 }}>Nearby shops</div>
              {nearbyShops.map((shop, i) => (
                <div key={i} className="shop-row">
                  <span>{shop.name}</span>
                  <span style={{ color: "var(--color-text-secondary)", fontSize: 12 }}>{shop.address}</span>
                </div>
              ))}
            </>
          )}
        </div>
      )}
      {showAssignModal && (
  <Modal title="Assign Driver" onClose={() => setShowAssignModal(false)}>
    {assignError && <p className="form-error">{assignError}</p>}
    <div className="form-group">
      <label>Driver</label>
      <select className="select-boxed" value={selectedDriverId} onChange={(e) => setSelectedDriverId(e.target.value)}>
        <option value="">Unassigned</option>
        {drivers.map((d) => (
          <option key={d.id} value={d.id}>{d.first_name} {d.last_name}</option>
        ))}
      </select>
    </div>
    <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
      <button className="confirm-btn" style={{ background: "var(--color-primary)", color: "var(--color-button-text)", borderColor: "var(--color-primary)" }} onClick={handleConfirmAssign} disabled={assigningDriver}>
        {assigningDriver ? "Assigning..." : "Assign"}
      </button>
      <button className="confirm-btn" onClick={() => setShowAssignModal(false)}>Cancel</button>
    </div>
  </Modal>
)}
    </div>
  );
};

export default VehicleDetail;