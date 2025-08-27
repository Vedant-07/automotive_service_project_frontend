import { Routes, Route } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import NotFound from "../pages/NotFound";
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminLayout from "../layouts/AdminLayout";

//sample build for the adminroutes --> delete thhis commnet later
export default function AdminRoutes() {
  return (
    <Routes>
      <Route element={<PrivateRoute allowedRole="admin" />}>
        {/* TODO: create the layout for the admin */}

        <Route element={<AdminLayout />}>
          <Route path="/" element={<AdminDashboard />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
