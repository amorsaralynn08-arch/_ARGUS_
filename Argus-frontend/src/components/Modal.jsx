import { X } from "lucide-react";

const Modal = ({ title, onClose, children }) => (
  <div className="modal-overlay" onClick={onClose}>
    <div className="modal-box" onClick={(e) => e.stopPropagation()}>
      <div className="modal-header">
        <span>{title}</span>
        <button className="modal-close" onClick={onClose}><X size={16} /></button>
      </div>
      <div className="modal-body">{children}</div>
    </div>
  </div>
);

export default Modal;