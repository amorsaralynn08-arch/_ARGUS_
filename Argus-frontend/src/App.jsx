import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import FleetSetup from "./pages/FleetSetup";
import Dashboard from "./pages/Dashboard";
// import Vehicles from "./pages/Vehicles";
// import Maintenance from "./pages/Maintenance";
// import Alerts from "./pages/Alerts";
// import Profile from "./pages/Profile";
// import Settings from "./pages/Settings";

import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./layout/DashboardLayout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

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
          <Route index element={<Dashboard />} />
          {/* <Route path="vehicles" element={<Vehicles />} /> */}
          {/* <Route path="maintenance" element={<Maintenance />} /> */}
          {/* <Route path="alerts" element={<Alerts />} /> */}
          {/* <Route path="profile" element={<Profile />} /> */}
          {/* <Route path="settings" element={<Settings />} /> */}
        </Route>

        {/* Default Route */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Unknown Routes */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;