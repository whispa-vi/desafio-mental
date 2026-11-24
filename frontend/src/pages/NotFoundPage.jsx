import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <section className="card">
      <h1>Página no encontrada</h1>
      <p className="nota">La dirección no existe.</p>
      <Link to="/" className="btn">Ir al inicio</Link>
    </section>
  );
}
