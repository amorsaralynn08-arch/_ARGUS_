import { NavLink } from "react-router-dom";
import { Eye, LayoutGrid, Car, Wrench, Bell, User, Settings, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const navItems = [
  { to: "/dashboard", icon: LayoutGrid, label: "Overview", end: true },
  { to: "/dashboard/vehicles", icon: Car, label: "Vehicles" },
  { to: "/dashboard/maintenance", icon: Wrench, label: "Maintenance" },
  { to: "/dashboard/alerts", icon: Bell, label: "Alerts" },
];

const Sidebar = () => {
  const { user, logout } = useAuth();

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <Eye size={20} aria-hidden="true" />
        <span>ARGUS</span>
      </div>

      <nav className="sidebar-nav">
        {navItems.map(({ to, icon: Icon, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) => `sidebar-link${isActive ? " active" : ""}`}
          >
            <Icon size={17} aria-hidden="true" />
            <span>{label}</span>
          </NavLink>
        ))}
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
        <button className="sidebar-link logout-btn" onClick={logout}>
          <LogOut size={17} aria-hidden="true" />
          <span>Log out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;