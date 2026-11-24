import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useFetch } from "../hooks/useFetch.js";
import { gameService } from "../api/services.js";
import { gameSession } from "../utils/gameSession.js";
import { formatDate, formatDuration } from "../utils/format.js";
import StatCard from "../components/StatCard.jsx";
import ProgressBar from "../components/ProgressBar.jsx";
import Message from "../components/Message.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";

export default function ResultsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: result, loading, error, reload } = useFetch(() => gameService.result(id), [id]);
  const [startError, setStartError] = useState(null);
  const [starting, setStarting] = useState(false);

  // «Revancha»: misma categoría y cantidad (como «Nueva partida» del Parcial I)
  const playAgain = async () => {
    setStarting(true);
    try {
      const game = await gameService.start(result.category, result.totalQuestions);
      gameSession.start(game.id);
      navigate(`/partida/${game.id}`, { state: { game } });
    } catch (err) {
      setStartError(err);
      setStarting(false);
    }
  };

  if (loading) return <Message type="cargando">Cargando resultados...</Message>;
  if (error) return <ErrorMessage error={error} onRetry={reload} />;

  const abandoned = result.status === "abandonada";

  return (
    <section className="resultados">
      <div className="resultados-hero">
        <span className={abandoned ? "estado abandonada" : "estado completada"}>{abandoned ? "Partida abandonada" : "Partida completada"}</span>
        <h1>{abandoned ? "Partida abandonada" : result.message}</h1>
        <p className="nota">
          Categoría: <b>{result.category}</b> · Finalizada: <b>{formatDate(result.finishedAt)}</b> · Duración: <b>{formatDuration(result.durationSec)}</b>
        </p>
      </div>

      <div className="card puntaje-card">
        <small>Puntaje total</small>
        <b>{result.score} <span>pts</span></b>
      </div>

      <div className="stats cuatro">
        <StatCard value={`${result.correct} / ${result.totalQuestions}`} label="Correctas" tone="verde" />
        <StatCard value={`${result.wrong} / ${result.totalQuestions}`} label="Incorrectas" tone="rojo" />
        <StatCard value={`${result.percentage} %`} label="Efectividad">
          <ProgressBar value={result.percentage} tone="verde" label="Efectividad" />
        </StatCard>
        <StatCard value={result.bestStreak} label="Mejor racha" />
      </div>

      {result.answers.length > 0 && (
        <>
          <h2>Repaso de la partida</h2>
          <ul className="repaso">
            {result.answers.map((a) => (
              <li key={a.order} className={a.isCorrect ? "ok" : "error"}>
                <span className="repaso-num">{a.order}</span>
                <div className="texto">
                  <span className="titulo">{a.statement}</span>
                  <span className="repaso-respuesta">
                    {a.isCorrect && a.options[a.correctIndex]}
                    {!a.isCorrect && a.selectedIndex === null && `Sin respuesta (tiempo agotado) · Correcta: ${a.options[a.correctIndex]}`}
                    {!a.isCorrect && a.selectedIndex !== null && `Elegiste: ${a.options[a.selectedIndex]} · Correcta: ${a.options[a.correctIndex]}`}
                  </span>
                </div>
                {a.seconds !== null && <span className="dato">{a.seconds} s</span>}
                <span className="repaso-icono" aria-label={a.isCorrect ? "Correcta" : "Incorrecta"}>{a.isCorrect ? "✓" : "✗"}</span>
              </li>
            ))}
          </ul>
        </>
      )}

      {startError && <Message type="error">{startError.message}</Message>}
      <div className="acciones detalle">
        <button type="button" className="btn" onClick={playAgain} disabled={starting}>
          {starting ? "Preparando..." : "¡Revancha! Jugar otra"}
        </button>
        <Link to="/" className="btn ghost">Volver al menú</Link>
        <Link to="/ranking" className="btn ghost">Ver el ranking</Link>
      </div>
    </section>
  );
}
