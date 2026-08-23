import { NavLink } from "react-router-dom";
import { Eye, LayoutGrid, Car, Wrench, Bell, User, Settings, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import {useState} from "react";
import Modal from "./Modal";

const navItems = [
  { to: "/dashboard", icon: LayoutGrid, label: "Overview", end: true, ready: true },
  { to: "/dashboard/vehicles", icon: Car, label: "Vehicles", ready: true },
  { to: "/dashboard/maintenance", icon: Wrench, label: "Maintenance", ready: false },
  { to: "/dashboard/alerts", icon: Bell, label: "Alerts", ready: true },
];

const Sidebar = () => {
  const {user , logout } = useAuth();
  const [showConfirm , setShowConfirm] = useState(false);

  const handleConfirmLogout = () =>{
    sessionStorage.setItem("logoutMessage", `${user?.first_name || user?.username} has logged out successfully.`);
    logout();
    setShowConfirm(false);
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <Eye size={20} aria-hidden="true" />
        <span>ARGUS</span>
      </div>

      <nav className="sidebar-nav">
        {navItems.map(({ to, icon: Icon, label, end, ready }) =>
          ready ? (
            <NavLink key={to} to={to} end={end} className={({ isActive }) => `sidebar-link${isActive ? " active" : ""}`}>
              <Icon size={17} aria-hidden="true" />
              <span>{label}</span>
            </NavLink>
          ) : (
            <span key={to} className="sidebar-link disabled">
              <Icon size={17} aria-hidden="true" />
              <span>{label}</span>
            </span>
          )
        )}
      </nav>

      <div className="sidebar-footer">
        <NavLink to="/dashboard/profile" className={({ isActive }) => `sidebar-link${isActive ? " active" : ""}`}>
          <User size={17} aria-hidden="true" />
          <span>Profile</span>
        </NavLink>
        <NavLink to="/dashboard/settings" className={({ isActive }) => `sidebar-link${isActive ? " active" : ""}`}>
          <Settings size={17} aria-hidden="true" />
          <span>Settings</span>
        </NavLink>
        <button className="sidebar-link logout-btn" onClick={() => setShowConfirm(true)}>
          <LogOut size={17} aria-hidden="true" />
          <span>Log out</span>
        </button>
      </div>
      {showConfirm && (
        <Modal title="Log out?" onClose={() => setShowConfirm(false)}>
          <p style={{ fontSize: 13, color: "var(--color-text-secondary)", marginBottom: 20 }}>
            You'll need to sign in again to access your dashboard.
          </p>
          <div style={{ display: "flex", gap: 10 }}>
            <button className="confirm-btn danger" onClick={handleConfirmLogout}>Log out</button>
            <button className="confirm-btn" onClick={() => setShowConfirm(false)}>Cancel</button>
          </div>
        </Modal>
      )}
    </aside>
  );
};

export default Sidebar;