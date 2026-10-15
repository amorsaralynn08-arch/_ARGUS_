import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
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
                    className="link-btn"
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
        <div className="modal-overlay" onClick={closeResolve}>
          <form
            className="modal-box"
            onClick={(e) => e.stopPropagation()}
            onSubmit={submitResolve}
          >
            <div className="modal-header">
              <span>Resolve alert</span>
              <button type="button" className="modal-close" onClick={closeResolve}>
                <X size={16} />
              </button>
            </div>

            <p style={{ fontSize: 12, color: "var(--color-text-secondary)", marginTop: 0, marginBottom: "1rem" }}>
              {resolving.vehicle.registration_number} · {resolving.message}
            </p>

            <div className="form-group">
              <label className="form-label">Outcome</label>
              <select name="outcome" value={form.outcome} onChange={updateField} className="form-input">
                <option value="FIXED">Fixed (work was done)</option>
                <option value="FALSE_ALARM">False alarm (no work needed)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">
                {form.outcome === "FIXED" ? "What was done?" : "Why is this a false alarm?"}
              </label>
              <textarea
                name="note" value={form.note} onChange={updateField}
                required rows={3} className="form-input"
              />
            </div>

            {form.outcome === "FIXED" && (
              <>
                <div className="form-group">
                  <label className="form-label">Service type</label>
                  <input
                    name="service_type" value={form.service_type} onChange={updateField}
                    required placeholder="e.g. Coolant flush" className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Performed by</label>
                  <input
                    name="performed_by" value={form.performed_by} onChange={updateField}
                    required placeholder="Mechanic or garage name" className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Cost</label>
                  <input
                    name="cost" type="number" min="0" step="0.01"
                    value={form.cost} onChange={updateField} className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Date performed</label>
                  <input
                    name="date_performed" type="date"
                    value={form.date_performed} onChange={updateField} className="form-input"
                  />
                </div>
              </>
            )}

            {formError && (
              <p style={{ color: "var(--color-danger)", fontSize: 13 }}>{formError}</p>
            )}

            <div style={{ display: "flex", gap: 8, marginTop: "0.5rem" }}>
              <button type="button" className="confirm-btn" onClick={closeResolve}>
                Cancel
              </button>
              <button
                type="submit" className="add-btn" disabled={saving}
                style={{ flex: 1, justifyContent: "center" }}
              >
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