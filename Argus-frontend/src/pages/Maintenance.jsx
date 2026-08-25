import { useState, useEffect } from "react";
import api from "../api/axios";
import { Plus, ChevronLeft, ChevronRight, Printer } from "lucide-react";
import Modal from "../components/Modal";
import AddMaintenanceForm from "../components/AddMaintenanceForm";

const Maintenance = () => {
  const [records, setRecords] = useState([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [receiptRecord, setReceiptRecord] = useState(null);
  const pageSize = 10;

  const fetchRecords = async (p) => {
    setLoading(true);
    try {
      const { data } = await api.get(`maintenance/?page=${p}`);
      setRecords(data.results || []);
      setCount(data.count || 0);
    } catch (err) {
      console.error("Failed to load maintenance records:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRecords(page); }, [page]);

  const totalPages = Math.ceil(count / pageSize) || 1;

  return (
    <div>
      <div className="table-toolbar">
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.3rem" }}>Maintenance</h1>
        <button className="add-btn" onClick={() => setShowAddModal(true)}>
          <Plus size={15} /> Log Maintenance
        </button>
      </div>

      <div className="vehicle-table">
        <div className="table-row table-head" style={{ gridTemplateColumns: "1.5fr 1fr 2fr 1fr 1fr 0.5fr" }}>
          <div>Vehicle</div><div>Service</div><div>Description</div><div>Date</div><div>Logged by</div><div></div>
        </div>

        {loading ? (
          <div className="table-empty">Loading...</div>
        ) : records.length === 0 ? (
          <div className="table-empty">No maintenance records yet.</div>
        ) : (
          records.map((r) => (
            <div className="table-row" key={r.id} style={{ gridTemplateColumns: "1.5fr 1fr 2fr 1fr 1fr 0.5fr" }}>
              <div>{r.vehicle_display}</div>
              <div>{r.service_type}</div>
              <div>{r.description}</div>
              <div>{r.date_performed}</div>
              <div>{r.logged_by_name || "—"}</div>
              <div>
                <button className="icon-btn" onClick={() => setReceiptRecord(r)} title="Print receipt">
                  <Printer size={15} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {count > pageSize && (
        <div className="pagination">
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}><ChevronLeft size={16} /></button>
          <span>Page {page} of {totalPages}</span>
          <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}><ChevronRight size={16} /></button>
        </div>
      )}

      {showAddModal && (
        <Modal title="Log Maintenance" onClose={() => setShowAddModal(false)}>
          <AddMaintenanceForm onSuccess={() => { setShowAddModal(false); fetchRecords(page); }} />
        </Modal>
      )}

      {receiptRecord && (
        <Modal title="Maintenance Receipt" onClose={() => setReceiptRecord(null)}>
          <div className="receipt" id="printable-receipt">
            <div className="receipt-header">
              <span>ARGUS</span>
              <span>{new Date().toLocaleDateString()}</span>
            </div>
            <div className="receipt-row"><span>Vehicle</span><span>{receiptRecord.vehicle_display}</span></div>
            <div className="receipt-row"><span>Service</span><span>{receiptRecord.service_type}</span></div>
            <div className="receipt-row"><span>Description</span><span>{receiptRecord.description}</span></div>
            <div className="receipt-row"><span>Performed by</span><span>{receiptRecord.performed_by}</span></div>
            <div className="receipt-row"><span>Date</span><span>{receiptRecord.date_performed}</span></div>
            {receiptRecord.cost && <div className="receipt-row"><span>Cost</span><span>KES {receiptRecord.cost}</span></div>}
            <div className="receipt-row"><span>Logged by</span><span>{receiptRecord.logged_by_name || "—"}</span></div>
          </div>
          <button className="add-btn" style={{ width: "100%", justifyContent: "center", marginTop: 16 }} onClick={() => window.print()}>
            <Printer size={15} /> Print
          </button>
        </Modal>
      )}
    </div>
  );
};

export default Maintenance;x