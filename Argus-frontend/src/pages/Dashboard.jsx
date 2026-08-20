import { useState, useEffect } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { Search, Plus } from "lucide-react";
import Modal from "../components/Modal";
import AddVehicleForm from "../components/AddVehicleForm";
import { useNavigate } from "react-router-dom";

const statusStyles = {
  ACTIVE: { label: "Normal", color: "var(--color-success)" },
  MAINTENANCE: { label: "Maintenance", color: "var(--color-warning)" },
  CRITICAL: { label: "Critical", color: "var(--color-danger)" },
  OFFLINE: { label: "Offline", color: "var(--color-text-secondary)" },
};

const Dashboard = () => {
  const { user } = useAuth();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const navigate = useNavigate();

  const fetchVehicles = async (query = "") => {
    setLoading(true);
    try {
      const { data } = await api.get(`vehicles/${query ? `?search=${query}` : ""}`);
      setVehicles(Array.isArray(data) ? data : data.results || []);
    } catch (err) {
      console.error("Failed to load vehicles:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => fetchVehicles(search), 400);
    return () => clearTimeout(timeout);
  }, [search]);

  const counts = vehicles.reduce(
    (acc, v) => {
      acc.total += 1;
      if (v.status === "ACTIVE") acc.normal += 1;
      else if (v.status === "MAINTENANCE") acc.warning += 1;
      else if (v.status === "CRITICAL") acc.critical += 1;
      return acc;
    },
    { total: 0, normal: 0, warning: 0, critical: 0 }
  );

  return (
    <div>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.3rem", marginBottom: "1.5rem" }}>
        Welcome, {user?.first_name || user?.username}
      </h1>

      <div className="stat-grid">
        <div className="stat-card"><div className="stat-label">Total vehicles</div><div className="stat-value">{counts.total}</div></div>
        <div className="stat-card"><div className="stat-label">Normal</div><div className="stat-value" style={{ color: "var(--color-success)" }}>{counts.normal}</div></div>
        <div className="stat-card"><div className="stat-label">Warning</div><div className="stat-value" style={{ color: "var(--color-warning)" }}>{counts.warning}</div></div>
        <div className="stat-card"><div className="stat-label">Critical</div><div className="stat-value" style={{ color: "var(--color-danger)" }}>{counts.critical}</div></div>
      </div>

      <div className="table-toolbar">
        <div className="search-box">
          <Search size={15} />
          <input placeholder="Search vehicles..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <button className="add-btn" onClick={() => setShowAddModal(true)}>
          <Plus size={15} /> Add Vehicle
        </button>
      </div>

      <div className="vehicle-table">
        <div className="table-row table-head">
          <div>Vehicle</div><div>Reg. number</div><div>Status</div><div>Year</div>
        </div>

        {loading ? (
          <div className="table-empty">Loading...</div>
        ) : vehicles.length === 0 ? (
          <div className="table-empty">No vehicles yet — add your first one to get started.</div>
        ) : (
          vehicles.map((v) => {
            const s = statusStyles[v.status] || statusStyles.ACTIVE;
            return (
                <div className="table-row" key={v.id} onClick={() => navigate(`/dashboard/vehicles/${v.id}`)} style={{ cursor: "pointer" }}>
                <div>{v.manufacturer} {v.model}</div>
                <div>{v.registration_number}</div>
                <div style={{ color: s.color }}>{s.label}</div>
                <div>{v.year}</div>
              </div>
            );
          })
        )}
      </div>

      {showAddModal && (
        <Modal title="Add Vehicle" onClose={() => setShowAddModal(false)}>
          <AddVehicleForm onSuccess={(newVehicle) => { setVehicles((v) => [newVehicle, ...v]); setShowAddModal(false); }} />
        </Modal>
      )}
    </div>
  );
};

export default Dashboard;