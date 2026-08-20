import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Search, Plus } from "lucide-react";
import Modal from "../components/Modal";
import AddVehicleForm from "../components/AddVehicleForm";
import VehicleTable from "../components/VehicleTable";
import useVehicles from "../hooks/useVehicles";

const Dashboard = () => {
  const { user } = useAuth();
  const { vehicles, loading, search, setSearch, addVehicle } = useVehicles();
  const [showAddModal, setShowAddModal] = useState(false);

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

      <VehicleTable vehicles={vehicles} loading={loading} />

      {showAddModal && (
        <Modal title="Add Vehicle" onClose={() => setShowAddModal(false)}>
          <AddVehicleForm onSuccess={(v) => { addVehicle(v); setShowAddModal(false); }} />
        </Modal>
      )}
    </div>
  );
};

export default Dashboard;