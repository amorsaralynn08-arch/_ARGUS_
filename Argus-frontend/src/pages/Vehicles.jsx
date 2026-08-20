import { useState } from "react";
import { Search, Plus } from "lucide-react";
import useVehicles from "../hooks/useVehicles";
import VehicleTable from "../components/VehicleTable";
import Modal from "../components/Modal";
import AddVehicleForm from "../components/AddVehicleForm";

const Vehicles = () => {
  const { vehicles, loading, search, setSearch, addVehicle } = useVehicles();
  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <div>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.3rem", marginBottom: "1.5rem" }}>
        Vehicles
      </h1>

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

export default Vehicles;