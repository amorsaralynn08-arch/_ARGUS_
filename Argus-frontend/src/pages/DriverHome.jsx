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
        <div className="vehicle-table">
          <div className="table-row table-head">
            <div>Vehicle</div><div>Reg. number</div><div>Status</div><div>Year</div>
          </div>
          {vehicles.map((v) => {
            const s = statusStyles[v.status] || statusStyles.ACTIVE;
            return (
              <div className="table-row" key={v.id} onClick={() => navigate(`/driver/vehicles/${v.id}`)} style={{ cursor: "pointer" }}>
                <div>{v.manufacturer} {v.model}</div>
                <div>{v.registration_number}</div>
                <div style={{ color: s.color }}>{s.label}</div>
                <div>{v.year}</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DriverHome;