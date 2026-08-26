import { useState, useEffect } from "react";
import api from "../api/axios";
import { Plus } from "lucide-react";
import Modal from "../components/Modal";
import AddStaffForm from "../components/AddStaffForm";

const Staff = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  const fetchStaff = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("users/");
      setStaff(Array.isArray(data) ? data : data.results || []);
    } catch (err) {
      console.error("Failed to load staff:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStaff(); }, []);

  return (
    <div>
      <div className="table-toolbar">
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.3rem" }}>Team</h1>
        <button className="add-btn" onClick={() => setShowAddModal(true)}>
          <Plus size={15} /> Add Team Member
        </button>
      </div>

      <div className="vehicle-table">
        <div className="table-row table-head" style={{ gridTemplateColumns: "1.5fr 1fr 1.5fr 1fr" }}>
          <div>Name</div><div>Role</div><div>Email</div><div>Phone</div>
        </div>

        {loading ? (
          <div className="table-empty">Loading...</div>
        ) : staff.length === 0 ? (
          <div className="table-empty">No team members yet.</div>
        ) : (
          staff.map((s) => (
            <div className="table-row" key={s.id} style={{ gridTemplateColumns: "1.5fr 1fr 1.5fr 1fr" }}>
              <div>{s.first_name} {s.last_name}</div>
              <div>{s.role}</div>
              <div>{s.email}</div>
              <div>{s.phone_number || "—"}</div>
            </div>
          ))
        )}
      </div>

      {showAddModal && (
        <Modal title="Add Team Member" onClose={() => setShowAddModal(false)}>
          <AddStaffForm onSuccess={() => { setShowAddModal(false); fetchStaff(); }} />
        </Modal>
      )}
    </div>
  );
};

export default Staff;