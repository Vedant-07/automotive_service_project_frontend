// src/routes/PublicRoute.jsx
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

export default function PublicRoute() {
  const role = useSelector((state) => state.user?.role);

  if (role) {
    try {
      // Redirect based on role
      if (role === "ADMIN") return <Navigate to="/admin" replace />;
      if (role === "SERVICE_MANAGER") return <Navigate to="/serviceManager" replace />;
      if (role === "CUSTOMER") return <Navigate to="/customer" replace />;
    } catch {
      return <Outlet />; // corrupted token → allow login
    }
  }

  return <Outlet />; // no token → allow login/signup
}
