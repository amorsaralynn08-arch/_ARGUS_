import { Outlet } from "react-router-dom";
import DriverSidebar from "../components/DriverSidebar";
import TopBar from "../components/TopBar";
import ScatteredEyes from "../components/ScatteredEyes";
import "../styles/dashboard.css";

const DriverLayout = () => (
  <div className="dashboard-shell">
    <DriverSidebar />
    <main className="dashboard-content">
      <ScatteredEyes />
       <TopBar />
      <div style={{ position: "relative", zIndex: 1 }}>
        <Outlet />
      </div>
    </main>
  </div>
);

export default DriverLayout;