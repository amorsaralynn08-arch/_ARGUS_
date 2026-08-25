import { useTheme } from "../context/ThemeContext";
import BrandEyeToggle from "../components/BrandEyeToggle";

const Settings = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.3rem", marginBottom: "1.5rem" }}>
        Settings
      </h1>

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
    </div>
  );
};

export default Settings;