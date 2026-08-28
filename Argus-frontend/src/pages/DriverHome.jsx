import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const statusStyles = {
  ACTIVE: { label: "Normal", color: "var(--color-success)" },
  MAINTENANCE: { label: "Maintenance", color: "var(--color-warning)" },
  CRITICAL: { label: "Critical", color: "var(--color-danger)" },
  OFFLINE: { label: "Offline", color: "var(--color-text-secondary)" },
};

const DriverHome = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("vehicles/")
      .then(({ data }) => setVehicles(Array.isArray(data) ? data : data.results || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.3rem", marginBottom: "1.5rem" }}>
        Welcome, {user?.first_name || user?.username}
      </h1>

      {loading ? (
        <div className="table-empty">Loading...</div>
      ) : vehicles.length === 0 ? (
        <div className="table-empty">No vehicle assigned to you yet.</div>
      ) : (
        vehicles.map((v) => {
          const s = statusStyles[v.status] || statusStyles.ACTIVE;
          return (
            <div
              key={v.id}
              className="detail-info-grid"
              style={{ gridTemplateColumns: "1fr", cursor: "pointer", marginBottom: 12 }}
              onClick={() => navigate(`/driver/vehicles/${v.id}`)}
            >
              <div style={{ padding: "1.5rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem" }}>{v.manufacturer} {v.model}</div>
                  <div className="status-badge" style={{ color: s.color, borderColor: s.color }}>{s.label}</div>
                </div>
                <div style={{ fontSize: 13, color: "var(--color-text-secondary)", marginTop: 6 }}>
                  {v.registration_number} · {v.year}
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default DriverHome;