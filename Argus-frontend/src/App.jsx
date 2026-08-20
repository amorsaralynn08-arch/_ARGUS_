import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import FleetSetup from "./pages/FleetSetup";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import VehicleDetail from "./pages/VehicleDetail";
import Vehicles from "./pages/Vehicles";
// import Maintenance from "./pages/Maintenance";
import Alerts from "./pages/Alerts";
// import Profile from "./pages/Profile";
// import Settings from "./pages/Settings";

import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./layout/DashboardLayout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Navigate to="/" replace />} />
        

        {/* Fleet Setup */}
        <Route
          path="/fleet-setup"
          element={
            <ProtectedRoute>
              <FleetSetup />
            </ProtectedRoute>
          }
        />

        {/* Protected Dashboard Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute requireCompany>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >

 {/* /dashboard */}
          <Route index element={<Dashboard />} />

          {/* /dashboard/vehicles/:id */}
          <Route path="vehicles" element={<Vehicles />} />
          <Route path="vehicles/:id" element={<VehicleDetail />} />
          <Route path="alerts" element={<Alerts />} />
          <Route path="profile" element={<Profile />} />

          {/* Future routes */}

          {/* <Route path="maintenance" element={<Maintenance />} /> */}
          
          {/* <Route path="settings" element={<Settings />} /> */}
        </Route>
         

        {/* Unknown Routes */}
         <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;