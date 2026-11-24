import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";
import Message from "./Message.jsx";

// Solo con sesión iniciada; si no, al login
export default function ProtectedRoute() {
  const { user, restoring } = useAuth();
  const location = useLocation();

  if (restoring) {
    return <Message type="cargando">Recuperando la sesión...</Message>;
  }
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  return <Outlet />;
}
