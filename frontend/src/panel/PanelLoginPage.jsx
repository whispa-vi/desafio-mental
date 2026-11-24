import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";
import FormField from "../components/FormField.jsx";
import Message from "../components/Message.jsx";

// Inicio de sesión del panel: pantalla propia, solo para administradores
export default function PanelLoginPage() {
  const { user, isAdmin, restoring, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [sending, setSending] = useState(false);

  if (restoring) {
    return <div className="panel-center"><Message type="cargando">Recuperando la sesión...</Message></div>;
  }
  if (isAdmin) {
    return <Navigate to="/panel" replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (username.trim() === "" || password === "") {
      setError("Completá el usuario y la contraseña.");
      return;
    }
    setSending(true);
    try {
      await login(username.trim(), password, "ADMIN");
      navigate(location.state?.from ?? "/panel", { replace: true });
    } catch (err) {
      setError(err.message);
      setSending(false);
    }
  };

  return (
    <div className="panel-login">
      <section className="panel-login-card">
        <div className="panel-brand">desafío<b>mental</b> <span>panel</span></div>
        <h1>Administración</h1>
        <p className="nota">Acceso solo para administradores.</p>
        {user && !isAdmin && (
          <Message type="info">Iniciaste sesión como {user.username} (jugador). Ingresá con una cuenta de administrador.</Message>
        )}
        <form onSubmit={handleSubmit} noValidate>
          <FormField id="panelUsuario" label="Usuario" autoComplete="username" value={username} onChange={(e) => setUsername(e.target.value)} />
          <FormField id="panelClave" label="Contraseña" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button type="submit" className="btn full" disabled={sending}>{sending ? "Ingresando..." : "Ingresar al panel"}</button>
        </form>
        {error && <Message type="error">{error}</Message>}
        <p className="cambio"><Link to="/" className="enlace">Ir al juego</Link></p>
      </section>
    </div>
  );
}
