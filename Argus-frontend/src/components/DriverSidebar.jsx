import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Car, Bell, Wrench, User, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import BrandEyeToggle from "./BrandEyeToggle";
import Modal from "./Modal";

const DriverSidebar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleConfirmLogout = () => {
    sessionStorage.setItem("logoutMessage", `${user?.first_name || user?.username} has logged out.`);
    logout();
    setShowConfirm(false);
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <BrandEyeToggle theme={theme} onClick={toggleTheme} />
        <span>ARGUS</span>
      </div>

      
  <nav className="sidebar-nav">
  <NavLink to="/driver" end className={({ isActive }) => `sidebar-link${isActive ? " active" : ""}`}>
    <Car size={17} aria-hidden="true" />
    <span>My Vehicle</span>
  </NavLink>
  <NavLink to="/driver/alerts" className={({ isActive }) => `sidebar-link${isActive ? " active" : ""}`}>
    <Bell size={17} aria-hidden="true" />
    <span>Alerts</span>
  </NavLink>
  <NavLink to="/driver/maintenance" className={({ isActive }) => `sidebar-link${isActive ? " active" : ""}`}>
    <Wrench size={17} aria-hidden="true" />
    <span>Maintenance</span>
  </NavLink>
  </nav>

      <div className="sidebar-footer">
        <NavLink to="/driver/profile" className={({ isActive }) => `sidebar-link${isActive ? " active" : ""}`}>
          <User size={17} aria-hidden="true" />
          <span>Profile</span>
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

export default DriverSidebar;