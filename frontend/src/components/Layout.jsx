import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  // Durante la partida no se muestra la navegación (solo se sale con «Salir»)
  const playing = pathname.startsWith("/partida/");

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      <header className="topbar">
        <div className="logo">
          desafío<b>mental</b>
        </div>
        {user && !playing && (
          <button type="button" className="btn ghost sm" onClick={handleLogout}>
            Cerrar sesión
          </button>
        )}
      </header>

      {user && !playing && (
        <nav className="nav" aria-label="Secciones">
          <NavLink to="/" end>Menú</NavLink>
          <NavLink to="/historial">Historial</NavLink>
          <NavLink to="/ranking">Ranking</NavLink>
        </nav>
      )}

      <main className="contenedor">
        <Outlet />
      </main>
    </>
  );
}
