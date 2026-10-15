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

const emptyForm = {
  outcome: "FIXED",
  note: "",
  service_type: "",
  performed_by: "",
  cost: "",
  date_performed: "",
};

const fieldStyle = {
  width: "100%",
  padding: "0.5rem",
  marginTop: "0.25rem",
  marginBottom: "0.75rem",
  boxSizing: "border-box",
};

const Alerts = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [resolving, setResolving] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

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

  const openResolve = (alert) => {
    setResolving(alert);
    setForm(emptyForm);
    setFormError("");
  };

  const closeResolve = () => setResolving(null);

  const updateField = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const submitResolve = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFormError("");

    const payload = { outcome: form.outcome, note: form.note };
    if (form.outcome === "FIXED") {
      payload.service_type = form.service_type;
      payload.performed_by = form.performed_by;
      if (form.cost !== "") payload.cost = form.cost;
      if (form.date_performed) payload.date_performed = form.date_performed;
    }

    try {
      const { data } = await api.post(`alerts/${resolving.id}/resolve/`, payload);
      setAlerts((prev) => prev.map((a) => (a.id === data.id ? data : a)));
      window.dispatchEvent(new Event("alerts-changed"));
      setResolving(null);
    } catch (err) {
      const d = err.response?.data;
      setFormError(
        d ? Object.values(d).flat().join(" ") : "Something went wrong. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.3rem", marginBottom: "1.5rem" }}>
        Alerts
      </h1>

      <div className="vehicle-table">
        <div className="table-row table-head" style={{ gridTemplateColumns: "0.8fr 1.5fr 2fr 1fr 0.8fr" }}>
          <div>Severity</div><div>Vehicle</div><div>Message</div><div>Time</div><div>Action</div>
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
              style={{ gridTemplateColumns: "0.8fr 1.5fr 2fr 1fr 0.8fr", cursor: "pointer" }}
              onClick={() => navigate(`${getHomeRouteForRole(user?.role)}/vehicles/${a.vehicle.id}`)}
            >
              <div style={{ color: severityStyles[a.severity] || "var(--color-text-primary)", fontWeight: 500 }}>{a.severity}</div>
              <div>{a.vehicle.manufacturer} {a.vehicle.model} · {a.vehicle.registration_number}</div>
              <div>{a.message}</div>
              <div style={{ color: "var(--color-text-secondary)", fontSize: 12 }}>{new Date(a.created_at).toLocaleString()}</div>
              <div>
                {a.is_resolved ? (
                  <span style={{ color: "var(--color-text-secondary)", fontSize: 12 }}>Resolved ✓</span>
                ) : user?.role === "DRIVER" ? (
                  <span style={{ color: "var(--color-text-secondary)", fontSize: 12 }}>Open</span>
                ) : (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openResolve(a);
                    }}
                  >
                    Resolve
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {resolving && (
        <div
          onClick={closeResolve}
          style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
            display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000,
          }}
        >
          <form
            onClick={(e) => e.stopPropagation()}
            onSubmit={submitResolve}
            style={{
              background: "var(--color-surface, #fff)",
              color: "var(--color-text-primary)",
              padding: "1.5rem", borderRadius: 12,
              width: "min(480px, 92vw)", maxHeight: "90vh", overflowY: "auto",
            }}
          >
            <h2 style={{ marginTop: 0, fontSize: "1.1rem" }}>Resolve alert</h2>
            <p style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>
              {resolving.vehicle.registration_number} · {resolving.message}
            </p>

            <label>
              Outcome
              <select name="outcome" value={form.outcome} onChange={updateField} style={fieldStyle}>
                <option value="FIXED">Fixed (work was done)</option>
                <option value="FALSE_ALARM">False alarm (no work needed)</option>
              </select>
            </label>

            <label>
              {form.outcome === "FIXED" ? "What was done?" : "Why is this a false alarm?"}
              <textarea
                name="note" value={form.note} onChange={updateField}
                required rows={3} style={fieldStyle}
              />
            </label>

            {form.outcome === "FIXED" && (
              <>
                <label>
                  Service type
                  <input
                    name="service_type" value={form.service_type} onChange={updateField}
                    required placeholder="e.g. Coolant flush" style={fieldStyle}
                  />
                </label>
                <label>
                  Performed by
                  <input
                    name="performed_by" value={form.performed_by} onChange={updateField}
                    required placeholder="Mechanic or garage name" style={fieldStyle}
                  />
                </label>
                <label>
                  Cost
                  <input
                    name="cost" type="number" min="0" step="0.01"
                    value={form.cost} onChange={updateField} style={fieldStyle}
                  />
                </label>
                <label>
                  Date performed
                  <input
                    name="date_performed" type="date"
                    value={form.date_performed} onChange={updateField} style={fieldStyle}
                  />
                </label>
              </>
            )}

            {formError && (
              <p style={{ color: "var(--color-danger)", fontSize: 13 }}>{formError}</p>
            )}

            <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
              <button type="button" onClick={closeResolve}>Cancel</button>
              <button type="submit" disabled={saving}>
                {saving ? "Saving..." : "Save resolution"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Alerts;