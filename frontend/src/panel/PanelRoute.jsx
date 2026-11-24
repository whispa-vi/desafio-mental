import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";
import Message from "../components/Message.jsx";

// Todo /panel: solo ADMIN. Sin sesión o con rol USER → login del panel.
// La protección real está en el servidor (401/403).
export default function PanelRoute() {
  const { user, isAdmin, restoring } = useAuth();
  const location = useLocation();

  if (restoring) {
    return <div className="panel-center"><Message type="cargando">Recuperando la sesión...</Message></div>;
  }
  if (!user || !isAdmin) {
    return <Navigate to="/panel/login" replace state={{ from: location.pathname }} />;
  }
  return <Outlet />;
}
