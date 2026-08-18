import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import "../styles/dashboard.css";
import ScatteredEyes from "../components/ScatteredEyes";

const DashboardLayout = () => (
  <div className="dashboard-shell">
    <Sidebar />
    <main className="dashboard-content">
        <ScatteredEyes />
        <div style={{position:"relative",zIndex:1}}>
          <Outlet/>

        </div>
    </main>
  </div>
);

export default DashboardLayout;