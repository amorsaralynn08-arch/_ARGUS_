import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import BrandEyeToggle from "../components/BrandEyeToggle";
import api from "../api/axios";
import { useState } from "react";

const DriverSettings = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, refreshUser } = useAuth();
  const [notifyCritical, setNotifyCritical] = useState(user?.notify_critical_email ?? true);
  const [notifyWarning, setNotifyWarning] = useState(user?.notify_warning_email ?? false);

  const handleNotifyChange = async (field, value, setter) => {
    setter(value);
    try {
      await api.patch("profile/", { [field]: value });
      await refreshUser();
    } catch (err) {
      console.error("Failed to update notification preference:", err);
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
          <div className="settings-desc">Email me when my vehicle is flagged Critical.</div>
        </div>
        <input type="checkbox" checked={notifyCritical} onChange={(e) => handleNotifyChange("notify_critical_email", e.target.checked, setNotifyCritical)} />
      </div>
      <div className="settings-row">
        <div>
          <div className="settings-label">Warning alerts</div>
          <div className="settings-desc">Email me when my vehicle is flagged Warning.</div>
        </div>
        <input type="checkbox" checked={notifyWarning} onChange={(e) => handleNotifyChange("notify_warning_email", e.target.checked, setNotifyWarning)} />
      </div>
    </div>
  );
};

export default DriverSettings;