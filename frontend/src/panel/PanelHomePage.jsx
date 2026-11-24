import { Link } from "react-router-dom";
import { useFetch } from "../hooks/useFetch.js";
import { questionService, userService } from "../api/services.js";
import StatCard from "../components/StatCard.jsx";
import Message from "../components/Message.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";

export default function PanelHomePage() {
  const categories = useFetch(() => questionService.categories(), []);
  const users = useFetch(() => userService.list(), []);

  const totalQuestions = categories.data?.reduce((sum, c) => sum + c.count, 0) ?? 0;
  const admins = users.data?.filter((u) => u.role === "ADMIN").length ?? 0;

  return (
    <>
      <header className="panel-header">
        <h1>Resumen</h1>
        <Link to="/panel/preguntas/nueva" className="btn">Nueva pregunta</Link>
      </header>

      {(categories.loading || users.loading) && <Message type="cargando">Cargando datos...</Message>}
      {categories.error && <ErrorMessage error={categories.error} onRetry={categories.reload} />}
      {users.error && <ErrorMessage error={users.error} onRetry={users.reload} />}

      {categories.data && users.data && (
        <>
          <div className="stats">
            <StatCard value={totalQuestions} label="Preguntas activas" />
            <StatCard value={categories.data.length} label="Categorías" />
            <StatCard value={users.data.length - admins} label="Jugadores" tone="verde" />
          </div>

          <h2>Preguntas por categoría</h2>
          <div className="tabla-scroll">
            <table className="tabla">
              <thead>
                <tr><th>Categoría</th><th className="num">Preguntas</th><th className="num">Partida de 10</th><th></th></tr>
              </thead>
              <tbody>
                {categories.data.map((c) => (
                  <tr key={c.category}>
                    <td>{c.category}</td>
                    <td className="num">{c.count}</td>
                    <td className="num">
                      <span className={c.count >= 10 ? "estado completada" : "estado abandonada"}>{c.count >= 10 ? "sí" : "no"}</span>
                    </td>
                    <td className="acciones-celda">
                      <Link to={`/panel/preguntas?categoria=${encodeURIComponent(c.category)}`} className="btn ghost sm">Ver</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="nota detalle">Una partida de 10 preguntas solo se puede jugar en categorías con 10 preguntas o más.</p>
        </>
      )}
    </>
  );
}
