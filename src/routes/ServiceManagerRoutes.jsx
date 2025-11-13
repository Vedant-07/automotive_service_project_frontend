import { Routes, Route } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import NotFound from "../pages/NotFound";
import ServiceManagerDashboard from "../pages/serviceManager/ServiceManagerDashboard";
import ServiceManagerBookings from "../pages/serviceManager/ServiceManagerBookings"; 
import ServiceManagerHistory from "../pages/serviceManager/ServiceManagerHistory";
import ServiceManagerLayout from "../layouts/ServiceManagerLayout";
import ServiceCallCentreDashboard from "../pages/serviceManager/ServiceCallCentreDashboard";
import MechanicDashboard from "../pages/serviceManager/MechanicDashboard";

export default function ServiceManagerRoutes() {
  return (
    <Routes>
      {/* Temporarily allow direct access for testing - remove PrivateRoute wrapper */}
      <Route element={<ServiceManagerLayout />}>
        {/* Default dashboard */}
        <Route path="/" element={<ServiceManagerDashboard />} />

        {/* View Bookings */}
        <Route path="bookings" element={<ServiceManagerBookings />} />

        {/* Booking History */}
        <Route path="history" element={<ServiceManagerHistory />} />

        {/* Call Centre */}
        <Route path="call-centre" element={<ServiceCallCentreDashboard />} />

        {/* Mechanic Dashboard*/}
        <Route path="mechanic-dashboard" element={<MechanicDashboard />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
