import { useState } from "react";
import { Link } from "react-router-dom";
import { useFetch } from "../hooks/useFetch.js";
import { gameService, questionService } from "../api/services.js";
import { formatDate } from "../utils/format.js";
import PageHeader from "../components/PageHeader.jsx";
import StatCard from "../components/StatCard.jsx";
import FormField from "../components/FormField.jsx";
import Message from "../components/Message.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";
import EmptyItem from "../components/EmptyItem.jsx";

export default function HistoryPage() {
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const history = useFetch(() => gameService.history({ category, status }), [category, status]);
  const categories = useFetch(() => questionService.categories(), []);

  const summary = history.data?.summary;
  const hasGames = summary && summary.completed + summary.abandoned > 0;

  return (
    <section>
      <PageHeader title="Historial">Tus partidas, de la más reciente a la más antigua.</PageHeader>

      {history.error && <ErrorMessage error={history.error} onRetry={history.reload} />}

      {summary && (
        <>
          <h2>Revisión del historial</h2>
          <div className="stats">
            <StatCard value={summary.completed} label="Completadas" tone="verde" />
            <StatCard value={summary.abandoned} label="Abandonadas" tone="rojo" />
            <StatCard value={summary.score} label="Puntaje acumulado" />
          </div>
        </>
      )}

      <h2>Filtros</h2>
      <div className="fila">
        <FormField id="filtroCategoria" label="Categoría" as="select" value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">Todas</option>
          {categories.data?.map((c) => (
            <option key={c.category} value={c.category}>{c.category}</option>
          ))}
        </FormField>
        <FormField id="filtroEstado" label="Estado" as="select" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">Todas</option>
          <option value="completada">Completadas</option>
          <option value="abandonada">Abandonadas</option>
        </FormField>
      </div>

      <h2>Partidas</h2>
      {history.loading && <Message type="cargando">Cargando historial...</Message>}
      {history.data && (
        <ul className="lista">
          {!hasGames && <EmptyItem>Todavía no hay resultados disponibles.</EmptyItem>}
          {hasGames && history.data.games.length === 0 && <EmptyItem>No hay partidas que coincidan con los filtros.</EmptyItem>}
          {history.data.games.map((game) => (
            <li key={game.id}>
              <div className="texto">
                <Link to={`/resultados/${game.id}`} className="titulo enlace-lista">{game.category}</Link>
                <span className="id">{formatDate(game.finishedAt)}</span>
              </div>
              <span className="dato">{game.correct}/{game.totalQuestions} correctas</span>
              <span className="dato">{game.score} pts</span>
              <span className={`estado ${game.status}`}>{game.status}</span>
            </li>
          ))}
        </ul>
      )}
      <Link to="/" className="btn ghost volver">Volver al menú</Link>
    </section>
  );
}
