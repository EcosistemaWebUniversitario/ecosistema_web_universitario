import { Navigate, Outlet } from "react-router-dom";

export const ProtectedRoute = ({ rol, children }) => {
  const token = localStorage.getItem("token");
  const rolUsuario = localStorage.getItem("rol");

  if (!token) {
    return <Navigate to="/" replace />;
  }

  if (rol && rolUsuario !== rol) {
    return <Navigate to="/" replace />;
  }

  return children ? children : <Outlet />;
};
