import { useNavigate } from "react-router-dom";

const statusStyles = {
  ACTIVE: { label: "Normal", color: "var(--color-success)" },
  MAINTENANCE: { label: "Maintenance", color: "var(--color-warning)" },
  CRITICAL: { label: "Critical", color: "var(--color-danger)" },
  OFFLINE: { label: "Offline", color: "var(--color-text-secondary)" },
};

const VehicleTable = ({ vehicles, loading }) => {
  const navigate = useNavigate();

  return (
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
  );
};

export default VehicleTable;