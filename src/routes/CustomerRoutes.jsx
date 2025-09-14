import { Routes, Route } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import NotFound from "../pages/NotFound";
import CustomerLayout from "../layouts/CustomerLayout";
import CustomerDashboard from "../pages/customer/CustomerDashboard";

export default function CustomerRoutes() {
  return (
    <Routes>
      <Route element={<PrivateRoute allowedRole="CUSTOMER" />}>
        <Route element={<CustomerLayout />}>
          <Route path="/" element={<CustomerDashboard />} />
        </Route>
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
