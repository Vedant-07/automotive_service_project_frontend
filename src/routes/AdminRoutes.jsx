import { Routes, Route } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import Page404 from "../pages/Page404";
import AdminDashboard from "../pages/AdminDashboard";
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

      <Route path="*" element={<Page404 />} />
    </Routes>
  );
}
