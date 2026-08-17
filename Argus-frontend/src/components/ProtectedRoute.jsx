import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, requireCompany = false }) => {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) return null; // or a spinner later

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (requireCompany && !user?.company) {
    return <Navigate to="/fleet-setup" replace />;
  }

  return children;
};

export default ProtectedRoute;