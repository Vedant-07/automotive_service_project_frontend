import { Routes, Route } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import NotFound from "../pages/NotFound";
import ServiceManagerDashboard from "../pages/serviceManager/ServiceManagerDashboard";
import ServiceManagerLayout from "../layouts/ServiceManagerLayout";

export default function ServiceManagerRoutes() {
  return (
    <Routes>
      <Route element={<PrivateRoute allowedRole="SERVICE_MANAGER" />}>
        <Route element={<ServiceManagerLayout />}>
          <Route path="/" element={<ServiceManagerDashboard />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
