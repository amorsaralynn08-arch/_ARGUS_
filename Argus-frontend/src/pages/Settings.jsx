import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import BrandEyeToggle from "../components/BrandEyeToggle";
import api from "../api/axios";

const Settings = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, refreshUser } = useAuth();

  const [notifyCritical, setNotifyCritical] = useState(user?.notify_critical_email ?? true);
  const [notifyWarning, setNotifyWarning] = useState(user?.notify_warning_email ?? false);
  const [currency, setCurrency] = useState(user?.company?.currency || "KES");
  const [unitSystem, setUnitSystem] = useState(user?.company?.unit_system || "KM");

  const handleNotifyChange = async (field, value, setter) => {
    setter(value);
    try {
      await api.patch("profile/", { [field]: value });
      await refreshUser();
    } catch (err) {
      console.error("Failed to update notification preference:", err);
    }
  };

  const handleRegionalChange = async (field, value, setter) => {
    setter(value);
    try {
      await api.patch(`companies/${user.company.id}/`, { [field]: value });
      await refreshUser();
    } catch (err) {
      console.error("Failed to update regional setting:", err);
    }
  };

  return (
    <div>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.3rem", marginBottom: "1.5rem" }}>Settings</h1>

      <h2 className="section-title" style={{ marginTop: 0 }}>Appearance</h2>
      <div className="settings-row">
        <div>
          <div className="settings-label">Theme</div>
          <div className="settings-desc">Switch between light and dark mode.</div>
        </div>
        <button className="theme-switch" onClick={toggleTheme}>
          <BrandEyeToggle theme={theme} onClick={toggleTheme} />
          <span>{theme === "light" ? "Light" : "Dark"}</span>
        </button>
      </div>

      <h2 className="section-title">Notifications</h2>
      <div className="settings-row">
        <div>
          <div className="settings-label">Critical alerts</div>
          <div className="settings-desc">Email me when a vehicle is flagged Critical.</div>
        </div>
        <input type="checkbox" checked={notifyCritical} onChange={(e) => handleNotifyChange("notify_critical_email", e.target.checked, setNotifyCritical)} />
      </div>
      <div className="settings-row">
        <div>
          <div className="settings-label">Warning alerts</div>
          <div className="settings-desc">Email me when a vehicle is flagged Warning.</div>
        </div>
        <input type="checkbox" checked={notifyWarning} onChange={(e) => handleNotifyChange("notify_warning_email", e.target.checked, setNotifyWarning)} />
      </div>

      <h2 className="section-title">Regional</h2>
      <div className="settings-row">
        <div>
          <div className="settings-label">Currency</div>
          <div className="settings-desc">Used for maintenance costs and receipts.</div>
        </div>
        <select className="select-input" style={{ width: 120 }} value={currency} onChange={(e) => handleRegionalChange("currency", e.target.value, setCurrency)}>
          <option value="KES">KES</option>
          <option value="USD">USD</option>
        </select>
      </div>
      <div className="settings-row">
        <div>
          <div className="settings-label">Units</div>
          <div className="settings-desc">Distance measurement across the app.</div>
        </div>
        <select className="select-input" style={{ width: 120 }} value={unitSystem} onChange={(e) => handleRegionalChange("unit_system", e.target.value, setUnitSystem)}>
          <option value="KM">Kilometers</option>
          <option value="MILES">Miles</option>
        </select>
      </div>

      <h2 className="section-title">Users & Access</h2>
      <div className="settings-row">
        <div>
          <div className="settings-label">Team members</div>
          <div className="settings-desc">Manage drivers and mechanics on your fleet.</div>
        </div>
        <Link to="/dashboard/staff" className="theme-switch" style={{ textDecoration: "none" }}>Manage Team</Link>
      </div>
    </div>
  );
};

export default Settings;