import { Routes, Route } from "react-router-dom";
import PublicLayout from "../layouts/PublicLayout";
import NotFound from "../pages/NotFound";

import LandingPage from "../pages/public/LandingPage";
import SignupPage from "../pages/auth/SignupPage";
import LoginPage from "../pages/auth/LoginPage";
import HelloPage from "../pages/HelloPage";

import AdminRoutes from "./AdminRoutes";
import CustomerRoutes from "./CustomerRoutes";
import ServiceManagerRoutes from "./ServiceManagerRoutes";
import Unauthorized from "../pages/Unauthorized";
import PublicRoute from "./PublicRoute";
import MechanicDashboard from "../pages/Mechanic/MechanicDashboard";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route element={<PublicLayout />}>
        {/* Guard login/signup so logged-in users can’t return */}
        <Route element={<PublicRoute />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Route>
        {/* Temp hello test route */}
        <Route path="/api/hello" element={<HelloPage />} />
      </Route>
          <Route path="/mechanic" element={<MechanicDashboard />} />

      {/* Protected role-based routes */}
      <Route path="/admin/*" element={<AdminRoutes />} />
      <Route path="/customer/*" element={<CustomerRoutes />} />
      <Route path="/serviceManager/*" element={<ServiceManagerRoutes />} />

      {/* Unauthorized */}
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* Catch-all */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
