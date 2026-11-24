import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";

// Estructura del panel: menú lateral + contenido (como un panel de administración)
export default function PanelLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/panel/login");
  };

  return (
    <div className="panel">
      <aside className="panel-sidebar">
        <div className="panel-brand">desafío<b>mental</b> <span>panel</span></div>
        <nav className="panel-nav" aria-label="Secciones del panel">
          <NavLink to="/panel" end>Resumen</NavLink>
          <NavLink to="/panel/preguntas">Preguntas</NavLink>
          <NavLink to="/panel/usuarios">Usuarios</NavLink>
        </nav>
        <div className="panel-user">
          <span>{user.username}</span>
          <small>Administrador</small>
          <button type="button" className="btn ghost sm" onClick={handleLogout}>Cerrar sesión</button>
          <NavLink to="/" className="enlace">Ir al juego</NavLink>
        </div>
      </aside>
      <main className="panel-main">
        <Outlet />
      </main>
    </div>
  );
}
