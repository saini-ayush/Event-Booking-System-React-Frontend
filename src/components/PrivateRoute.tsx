import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@contexts/AuthContext";

interface PrivateRouteProps {
  requireAdmin?: boolean;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({
  requireAdmin = false,
}) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    // You can show a loading spinner here
    return <div>Loading...</div>;
  }

  // Check if user is authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check if admin access is required but user is not an admin
  if (requireAdmin && user && !user.is_admin) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
