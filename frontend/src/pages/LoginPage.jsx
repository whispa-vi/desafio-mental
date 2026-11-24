import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";
import FormField from "../components/FormField.jsx";
import Message from "../components/Message.jsx";
import AuthTabs from "../components/AuthTabs.jsx";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState(location.state?.username ?? "");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(location.state?.message ? { type: "ok", text: location.state.message } : null);
  const [sending, setSending] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (username.trim() === "" || password === "") {
      setMessage({ type: "error", text: "Completá el usuario y la contraseña." });
      return;
    }
    setSending(true);
    try {
      await login(username.trim(), password);
      navigate(location.state?.from ?? "/", { replace: true });
    } catch (error) {
      setMessage({ type: "error", text: error.message });
      setSending(false);
    }
  };

  return (
    <section className="card">
      <AuthTabs />
      <h1>Iniciar sesión</h1>
      <p className="nota">Ingresá con tu nombre de usuario y contraseña.</p>
      <form onSubmit={handleSubmit} noValidate>
        <FormField id="usuario" label="Usuario" autoComplete="username" value={username} onChange={(e) => setUsername(e.target.value)} />
        <FormField id="clave" label="Contraseña" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="submit" className="btn full" disabled={sending}>
          {sending ? "Ingresando..." : "Ingresar"}
        </button>
      </form>
      {message && <Message type={message.type}>{message.text}</Message>}
      <p className="cambio">
        ¿No tenés cuenta? <Link to="/registro" className="enlace">Registrate</Link>
      </p>
    </section>
  );
}
