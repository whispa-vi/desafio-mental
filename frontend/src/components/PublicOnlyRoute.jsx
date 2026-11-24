import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";
import Message from "./Message.jsx";

// Login y registro: si ya hay sesión, ir al menú
export default function PublicOnlyRoute() {
  const { user, restoring } = useAuth();
  if (restoring) {
    return <Message type="cargando">Recuperando la sesión...</Message>;
  }
  return user ? <Navigate to="/" replace /> : <Outlet />;
}
