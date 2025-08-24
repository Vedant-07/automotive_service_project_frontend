import { Navigate, Outlet } from "react-router-dom";

export default function PrivateRoute({ allowedRole }) {
  //TODO: once jwt token works then fetch it from userstore
  //const { token, role } = useSelector((state) => state.auth);

  // if (!token) {
  //   return <Navigate to="/SignUp" replace />;
  // }

  // if (allowedRole && role !== allowedRole) {
  //   return <Navigate to="/unauthorized" replace />; //TODO: replace this unauth. with legit link
  // }

  return <Outlet />;
}
