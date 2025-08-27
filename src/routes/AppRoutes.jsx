import { Routes, Route } from "react-router-dom";
import PublicLayout from "../layouts/PublicLayout";
import PrivateLayout from "../layouts/PrivateLayout";
import PrivateRoute from "./PrivateRoute";

import LandingPage from "../pages/public/LandingPage";
import SignupPage from "../pages/auth/SignupPage";
import Dashboard from "../pages/customer/Dashboard";
import NotFound from "../pages/NotFound";

import AdminRoutes from "./AdminRoutes";
import HelloPage from "../pages/HelloPage";

export default function AppRoutes() {
  return (
    <>
      <Routes>
        {/* Public */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signup" element={<SignupPage />} />
          {/* TODO:remove this hellopage after deployment done */}
          <Route path="/api/hello" element={<HelloPage />} />
        </Route>

        {/* Private (normal user) */}
        <Route element={<PrivateRoute />}>
          <Route element={<PrivateLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>
        </Route>

        {/* Admin */}
        <Route path="/admin/*" element={<AdminRoutes />} />

        {/* Catch-all */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}
