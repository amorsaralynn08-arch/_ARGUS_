import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { getHomeRouteForRole } from "../utils/roleRoutes";

const severityStyles = {
  CRITICAL: "var(--color-danger)",
  WARNING: "var(--color-warning)",
  NORMAL: "var(--color-success)",
};

const Alerts = () => {
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get("alerts/");
        setAlerts(Array.isArray(data) ? data : data.results || []);
      } catch (err) {
        console.error("Failed to load alerts:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

   const { user } = useAuth();
   
  return (
    <div>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.3rem", marginBottom: "1.5rem" }}>
        Alerts
      </h1>

      <div className="vehicle-table">
        <div className="table-row table-head" style={{ gridTemplateColumns: "0.8fr 1.5fr 2fr 1fr" }}>
          <div>Severity</div><div>Vehicle</div><div>Message</div><div>Time</div>
        </div>

        {loading ? (
          <div className="table-empty">Loading...</div>
        ) : alerts.length === 0 ? (
          <div className="table-empty">No alerts yet.</div>
        ) : (
          alerts.map((a) => (
            <div
              className="table-row"
              key={a.id}
              style={{ gridTemplateColumns: "0.8fr 1.5fr 2fr 1fr", cursor: "pointer" }}
              onClick={() => navigate(`${getHomeRouteForRole(user?.role)}/vehicles/${a.vehicle.id}`)}
            >
              <div style={{ color: severityStyles[a.severity] || "var(--color-text-primary)", fontWeight: 500 }}>{a.severity}</div>
              <div>{a.vehicle.manufacturer} {a.vehicle.model} · {a.vehicle.registration_number}</div>
              <div>{a.message}</div>
              <div style={{ color: "var(--color-text-secondary)", fontSize: 12 }}>{new Date(a.created_at).toLocaleString()}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Alerts;