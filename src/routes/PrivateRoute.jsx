import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

export default function PrivateRoute({ allowedRole }) {
  //TODO: once jwt token works then fetch it from userstore
  const role = useSelector((store) => store.user?.role);
  // if (!token) {
  //   return <Navigate to="/login" replace />;
  // } TODO:Once theres token then combine with below step
  if (!role) {
    return <Navigate to="/login" replace />;
  }

  //if theres no role then redirect to login page
  //TODO: work left in this logic
  if (allowedRole !== role) {
    return <Navigate to="/unauthorized" replace />; //TODO: replace this with some unauth userpage
  }

  return <Outlet />;
}
