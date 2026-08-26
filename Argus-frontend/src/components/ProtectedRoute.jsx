import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getHomeRouteForRole } from "../utils/roleRoutes";

const ProtectedRoute = ({ children, requireCompany = false, allowedRoles = null }) => {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (requireCompany && !user?.company) return <Navigate to="/fleet-setup" replace />;

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to={getHomeRouteForRole(user?.role)} replace />;
  }

  return children;
};

export default ProtectedRoute;