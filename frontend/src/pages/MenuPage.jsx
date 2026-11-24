import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";
import { useFetch } from "../hooks/useFetch.js";
import { questionService, statsService, gameService } from "../api/services.js";
import { gameSession } from "../utils/gameSession.js";
import PageHeader from "../components/PageHeader.jsx";
import StatCard from "../components/StatCard.jsx";
import ProgressBar from "../components/ProgressBar.jsx";
import Message from "../components/Message.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";

const AMOUNTS = [
  { value: 5, title: "5 preguntas", hint: "Partida corta" },
  { value: 10, title: "10 preguntas", hint: "Partida larga" },
];

export default function MenuPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const stats = useFetch(() => statsService.me(), []);
  const categories = useFetch(() => questionService.categories(), []);
  // Porcentaje de aciertos en cada categoría (una petición por categoría)
  const mastery = useFetch(
    () => Promise.all((categories.data ?? []).map((c) => statsService.byCategory(c.category))),
    [categories.data]
  );

  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState(5);
  const [startMessage, setStartMessage] = useState(location.state?.message ? { type: "info", text: location.state.message } : null);
  const [starting, setStarting] = useState(false);

  // Mientras no se elija otra, se usa la primera categoría
  const selectedCategory = category || (categories.data?.[0]?.category ?? "");
  const selectedCount = categories.data?.find((c) => c.category === selectedCategory)?.count ?? 0;
  const totalQuestions = categories.data?.reduce((sum, c) => sum + c.count, 0) ?? 0;

  const startGame = async () => {
    setStarting(true);
    setStartMessage(null);
    try {
      const game = await gameService.start(selectedCategory, amount);
      gameSession.start(game.id);
      navigate(`/partida/${game.id}`, { state: { game } });
    } catch (error) {
      setStartMessage({ type: "error", text: error.message });
      setStarting(false);
    }
  };

  return (
    <section>
      <PageHeader title="Desafío Mental">
        ¡Hola, {user.username}! Elegí una categoría y poné a prueba lo que sabés.
      </PageHeader>

      {stats.loading && <Message type="cargando">Cargando estadísticas...</Message>}
      {stats.error && <ErrorMessage error={stats.error} onRetry={stats.reload} />}
      {stats.data && (
        <div className="stats">
          <StatCard value={stats.data.completed} label="Partidas completadas" />
          <StatCard value={stats.data.questions} label="Preguntas respondidas" />
          <StatCard value={`${stats.data.percentage} %`} label="Respuestas correctas" tone="verde">
            <ProgressBar value={stats.data.percentage} tone="verde" label="Respuestas correctas" />
          </StatCard>
          <StatCard value={stats.data.bestScore} label="Puntaje más alto" />
          <StatCard value={stats.data.bestStreak} label="Mejor racha" />
        </div>
      )}

      <h2>Nueva partida</h2>
      {categories.loading && <Message type="cargando">Cargando preguntas...</Message>}
      {categories.error && <ErrorMessage error={categories.error} onRetry={categories.reload} />}
      {categories.data && categories.data.length === 0 && <Message type="info">Todavía no hay preguntas cargadas.</Message>}
      {categories.data && categories.data.length > 0 && (
        <div className="card nueva-partida">
          <p className="nota">Preguntas listas: {totalQuestions} disponibles.</p>

          <p className="subtitulo" id="titulo-categoria">Elegí tu categoría</p>
          <div className="categorias" role="radiogroup" aria-labelledby="titulo-categoria">
            {categories.data.map((c) => (
              <button
                key={c.category}
                type="button"
                role="radio"
                aria-checked={c.category === selectedCategory}
                className={c.category === selectedCategory ? "categoria-card activa" : "categoria-card"}
                onClick={() => setCategory(c.category)}
              >
                <span className="categoria-nombre">{c.category}</span>
                <span className="categoria-cantidad">{c.count} preguntas</span>
              </button>
            ))}
          </div>

          <p className="subtitulo" id="titulo-cantidad">Cantidad de preguntas</p>
          <div className="cantidades" role="radiogroup" aria-labelledby="titulo-cantidad">
            {AMOUNTS.map((a) => (
              <button
                key={a.value}
                type="button"
                role="radio"
                aria-checked={amount === a.value}
                className={amount === a.value ? "cantidad-card activa" : "cantidad-card"}
                onClick={() => setAmount(a.value)}
              >
                <span className="categoria-nombre">{a.title}</span>
                <span className="categoria-cantidad">
                  {selectedCount < a.value ? `No alcanzan: hay ${selectedCount} en esta categoría` : a.hint}
                </span>
              </button>
            ))}
          </div>

          <button type="button" className="btn full grande" onClick={startGame} disabled={starting || !selectedCategory}>
            {starting ? "Preparando..." : "¡Comenzar partida!"}
          </button>
          {startMessage && <Message type={startMessage.type}>{startMessage.text}</Message>}
        </div>
      )}

      {categories.data && categories.data.length > 0 && (
        <>
          <h2>Dominio de temas</h2>
          <div className="card dominio">
            <p className="nota">Porcentaje de respuestas correctas en cada categoría.</p>
            {mastery.loading && <Message type="cargando">Calculando...</Message>}
            {mastery.error && <ErrorMessage error={mastery.error} onRetry={mastery.reload} />}
            {mastery.data && (
              <ul className="dominio-lista">
                {mastery.data.map((m) => (
                  <li key={m.category}>
                    <div className="dominio-fila">
                      <span className="titulo">{m.category}</span>
                      <span className="dato">
                        {m.total === 0 ? "Sin respuestas todavía" : `${m.percentage} % (${m.correct} de ${m.total})`}
                      </span>
                    </div>
                    <ProgressBar value={m.percentage} tone={m.percentage >= 70 ? "verde" : m.percentage >= 40 ? "marron" : "rojo"} label={m.category} />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}

      <h2>Más opciones</h2>
      <div className="acciones">
        <Link to="/historial" className="btn ghost">Historial</Link>
        <Link to="/ranking" className="btn ghost">Ranking</Link>
      </div>
    </section>
  );
}
