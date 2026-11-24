import { NavLink } from "react-router-dom";

// Pestañas «Ingresar / Registrarme» arriba de los formularios de acceso
export default function AuthTabs() {
  return (
    <nav className="tabs" aria-label="Acceso">
      <NavLink to="/login">Ingresar</NavLink>
      <NavLink to="/registro">Registrarme</NavLink>
    </nav>
  );
}
