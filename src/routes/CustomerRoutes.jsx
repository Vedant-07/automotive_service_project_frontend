import { Routes, Route } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import NotFound from "../pages/NotFound";
import CustomerLayout from "../layouts/CustomerLayout";
import CustomerDashboard from "../pages/customer/CustomerDashboard";
import CustomerVehicles from "../pages/customer/CustomerVehicles";
import BookService from "../pages/customer/BookService";
import ServiceStatus from "../pages/customer/ServiceStatus";
import SubmitFeedback from "../pages/customer/SubmitFeedback";
import ViewFeedbacks from "../pages/customer/ViewFeedbacks";

export default function CustomerRoutes() {
  return (
    <Routes>
      <Route element={<PrivateRoute allowedRole="CUSTOMER" />}>
        <Route element={<CustomerLayout />}>
          <Route path="/" element={<CustomerDashboard />} />
          <Route path="vehicles" element={<CustomerVehicles />} />
          <Route path="vehicles/:vehicleId/book-service" element={<BookService />} />
          <Route path="service-status" element={<ServiceStatus />} />
          <Route path="feedbacks" element={<ViewFeedbacks />} />
          <Route path="feedbacks/submit" element={<SubmitFeedback />} />
        </Route>
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
