import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";
import FormField from "../components/FormField.jsx";
import Message from "../components/Message.jsx";
import AuthTabs from "../components/AuthTabs.jsx";

const EMPTY = { username: "", email: "", password: "", confirmPassword: "" };
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Datos -> Array<String>   (mismas reglas y mensajes que el Parcial I; el servidor vuelve a validar)
function validate(data) {
  const { username, email, password, confirmPassword } = data;
  if (!username.trim() || !email.trim() || !password || !confirmPassword) {
    return ["Completá todos los campos."];
  }
  const errors = [];
  if (!EMAIL_PATTERN.test(email.trim())) errors.push("El correo electrónico no tiene un formato válido.");
  if (username.trim().length < 4 || username.trim().length > 16) errors.push("El nombre de usuario debe tener entre 4 y 16 caracteres.");
  if (password.length < 8) errors.push("La contraseña debe tener al menos 8 caracteres.");
  if (password !== confirmPassword) errors.push("La contraseña y su confirmación no coinciden.");
  return errors;
}

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState([]);
  const [sending, setSending] = useState(false);

  const handleChange = (event) => setForm({ ...form, [event.target.name]: event.target.value });

  const handleSubmit = async (event) => {
    event.preventDefault();
    const found = validate(form);
    setErrors(found);
    if (found.length > 0) return; // los datos ingresados se conservan

    setSending(true);
    try {
      const user = await register({ ...form, username: form.username.trim(), email: form.email.trim() });
      navigate("/login", {
        state: { username: user.username, message: `¡Cuenta creada! Ya podés iniciar sesión, ${user.username}.` },
      });
    } catch (error) {
      setErrors(error.errors.length > 0 ? error.errors.map((e) => e.message) : [error.message]);
      setSending(false);
    }
  };

  return (
    <section className="card">
      <AuthTabs />
      <h1>Crear cuenta</h1>
      <p className="nota">Completá tus datos para empezar a jugar.</p>
      <form onSubmit={handleSubmit} noValidate>
        <FormField id="username" label="Nombre de usuario" autoComplete="username" value={form.username} onChange={handleChange} />
        <FormField id="email" label="Correo electrónico" autoComplete="email" value={form.email} onChange={handleChange} />
        <FormField id="password" label="Contraseña" type="password" autoComplete="new-password" value={form.password} onChange={handleChange} />
        <FormField id="confirmPassword" label="Confirmar contraseña" type="password" autoComplete="new-password" value={form.confirmPassword} onChange={handleChange} />
        <button type="submit" className="btn full" disabled={sending}>
          {sending ? "Registrando..." : "Registrarme"}
        </button>
      </form>
      {errors.length > 0 && <Message type="error" items={errors} />}
      <p className="cambio">
        ¿Ya tenés cuenta? <Link to="/login" className="enlace">Iniciar sesión</Link>
      </p>
    </section>
  );
}
