import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import "../styles/dashboard.css";

const DashboardLayout = () => (
  <div className="dashboard-shell">
    <Sidebar />
    <main className="dashboard-content">
      <Outlet />
    </main>
  </div>
);

export default DashboardLayout;