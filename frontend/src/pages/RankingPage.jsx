import { Link } from "react-router-dom";
import { useFetch } from "../hooks/useFetch.js";
import { useAuth } from "../hooks/useAuth.js";
import { statsService } from "../api/services.js";
import { formatDate, formatDuration } from "../utils/format.js";
import PageHeader from "../components/PageHeader.jsx";
import Message from "../components/Message.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";
import EmptyItem from "../components/EmptyItem.jsx";

// En el podio se muestran 2.º, 1.º y 3.º (el primero en el centro)
const PODIUM_ORDER = [1, 0, 2];

export default function RankingPage() {
  const { user } = useAuth();
  const { data: ranking, loading, error, reload } = useFetch(() => statsService.ranking(), []);

  const podium = PODIUM_ORDER.map((i) => ranking?.[i]).filter(Boolean);
  const rest = ranking?.slice(3) ?? [];
  const isMine = (row) => row.username === user.username;

  return (
    <section>
      <PageHeader title="Ranking">Los diez mejores resultados de partidas completadas.</PageHeader>
      {loading && <Message type="cargando">Cargando ranking...</Message>}
      {error && <ErrorMessage error={error} onRetry={reload} />}
      {ranking && ranking.length === 0 && (
        <ul className="lista"><EmptyItem>Todavía no hay partidas completadas en el ranking.</EmptyItem></ul>
      )}

      {podium.length > 0 && (
        <div className="podio">
          {podium.map((row) => (
            <div key={row.position} className={`podio-card puesto-${row.position}`}>
              <span className="posicion">{row.position}</span>
              <span className="titulo">
                {row.username}
                {isMine(row) && <span className="vos">vos</span>}
              </span>
              <b className="podio-puntos">{row.score} pts</b>
              <span className="id">{row.category} · {formatDuration(row.durationSec)}</span>
            </div>
          ))}
        </div>
      )}

      {rest.length > 0 && (
        <ul className="lista">
          {rest.map((row) => (
            <li key={row.position} className={isMine(row) ? "propio" : undefined}>
              <span className="posicion">{row.position}</span>
              <div className="texto">
                <span className="titulo">
                  {row.username}
                  {isMine(row) && <span className="vos">vos</span>}
                </span>
                <span className="id">{row.category} · {formatDate(row.finishedAt)} · {formatDuration(row.durationSec)}</span>
              </div>
              <span className="dato">{row.score} pts</span>
            </li>
          ))}
        </ul>
      )}
      <Link to="/" className="btn ghost volver">Volver al menú</Link>
    </section>
  );
}
