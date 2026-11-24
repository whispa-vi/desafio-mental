import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { gameService } from "../api/services.js";
import { gameSession } from "../utils/gameSession.js";
import Message from "../components/Message.jsx";
import ConfirmModal from "../components/ConfirmModal.jsx";
import Countdown from "../components/Countdown.jsx";
import ProgressBar from "../components/ProgressBar.jsx";

const PAUSE_MS = 2000; // tiempo para ver la corrección antes de la siguiente pregunta
const LETTERS = ["A", "B", "C", "D"];

export default function GamePage() {
  const { id } = useParams();
  const location = useLocation();
  const game = location.state?.game;

  // Si la página se recargó o se entró por la URL, la partida no se puede continuar
  if (!game || game.id !== id || !gameSession.isActive(id)) {
    return <InterruptedGame id={id} />;
  }
  return <GamePlay key={id} game={game} />;
}

function GamePlay({ game }) {
  const navigate = useNavigate();
  const [question, setQuestion] = useState(game.question);
  const [score, setScore] = useState(game.score);
  const [streak, setStreak] = useState(0);
  const [phase, setPhase] = useState("answering"); // answering | sending | feedback | error
  const [feedback, setFeedback] = useState(null);
  const [error, setError] = useState(null);
  const [confirmExit, setConfirmExit] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const phaseRef = useRef("answering");
  const nextTimeout = useRef(null);

  const changePhase = (value) => {
    phaseRef.current = value;
    setPhase(value);
  };

  useEffect(() => () => clearTimeout(nextTimeout.current), []);

  const answer = async (selectedIndex) => {
    if (phaseRef.current !== "answering") return; // un solo envío por pregunta
    changePhase("sending");
    try {
      const result = await gameService.answer(game.id, question.questionId, selectedIndex);
      setFeedback({ ...result, selectedIndex });
      setScore(result.score);
      setStreak(result.currentStreak);
      changePhase("feedback");
      nextTimeout.current = setTimeout(() => {
        if (result.finished) {
          gameSession.end(game.id);
          navigate(`/resultados/${game.id}`, { replace: true });
        } else {
          setQuestion(result.next);
          setFeedback(null);
          changePhase("answering");
        }
      }, PAUSE_MS);
    } catch (err) {
      setError(err);
      changePhase("error");
    }
  };

  const leave = async () => {
    setLeaving(true);
    clearTimeout(nextTimeout.current);
    try {
      await gameService.abandon(game.id);
    } catch {
      // si ya había terminado, igual se vuelve al menú
    }
    gameSession.end(game.id);
    navigate("/", { replace: true, state: { message: "La partida quedó registrada como abandonada." } });
  };

  const optionClass = (index) => {
    if (!feedback) return "opcion";
    if (index === feedback.correctIndex) return "opcion correcta";
    if (index === feedback.selectedIndex) return "opcion incorrecta";
    return "opcion";
  };

  let feedbackText = null;
  if (feedback) {
    const correctText = question.options[feedback.correctIndex];
    if (feedback.isCorrect) feedbackText = `¡Correcto! Sumaste ${feedback.pointsEarned} puntos.`;
    else if (feedback.timedOut) feedbackText = `Se terminó el tiempo. La respuesta correcta era: ${correctText}.`;
    else feedbackText = `Respuesta incorrecta. La respuesta correcta era: ${correctText}.`;
  }

  const answered = question.order - 1 + (feedback ? 1 : 0);
  const progress = (answered * 100) / question.total;

  let bannerTitle = null;
  if (feedback) {
    if (feedback.isCorrect) bannerTitle = "¡Bien ahí!";
    else if (feedback.timedOut) bannerTitle = "¡Se acabó el tiempo!";
    else bannerTitle = "Uf, casi...";
  }

  return (
    <section className="partida">
      {/* Panel superior: datos de la partida */}
      <div className="card partida-panel">
        <div className="partida-fila">
          <span className="chip">{game.category} · Pregunta {question.order} de {question.total}</span>
          <button type="button" className="cerrar" onClick={() => setConfirmExit(true)} disabled={leaving} aria-label="Salir de la partida" title="Salir">
            ×
          </button>
        </div>
        <div className="pills">
          {/* key: con cada pregunta nueva el reloj vuelve a empezar */}
          <Countdown
            key={question.questionId}
            seconds={question.seconds}
            running={phase === "answering" && !confirmExit}
            onExpire={() => answer(null)}
          />
          <span className="pill racha-pill">Racha: {streak}</span>
          <span className="pill">Puntaje: <b>{score}</b> pts</span>
        </div>
        <div className="progreso-fila">
          <span>Progreso de la partida</span>
          <span>{Math.round(progress)} % completado</span>
        </div>
        <ProgressBar value={progress} label="Progreso de la partida" />
      </div>

      {/* La pregunta */}
      <div className="card pregunta-card">
        <p className="nota">{question.points} puntos</p>
        <h1 className="enunciado">{question.statement}</h1>
        <div className="opciones">
          {question.options.map((option, index) => (
            <button key={index} type="button" className={optionClass(index)} onClick={() => answer(index)} disabled={phase !== "answering"}>
              <span className="letra" aria-hidden="true">{LETTERS[index]}</span>
              <span className="opcion-texto">
                {option}
                {feedback && index === feedback.correctIndex && <small>Respuesta correcta</small>}
              </span>
            </button>
          ))}
        </div>
        {phase === "sending" && <Message type="cargando">Enviando respuesta...</Message>}
      </div>

      {/* Resultado de la respuesta */}
      {feedback && (
        <div className={feedback.isCorrect ? "banner ok" : "banner error"} role="status">
          <b>{bannerTitle}</b>
          <span>{feedbackText}</span>
        </div>
      )}
      {error && (
        <>
          <Message type="error">{error.message}</Message>
          <Link to="/" className="btn ghost sm reintentar">Volver al menú</Link>
        </>
      )}

      {confirmExit && (
        <ConfirmModal
          title="¿Salir de la partida?"
          confirmText="Sí, salir"
          busy={leaving}
          onConfirm={leave}
          onCancel={() => setConfirmExit(false)}
        >
          La partida quedará registrada como abandonada y no entrará en el ranking.
        </ConfirmModal>
      )}
    </section>
  );
}

// Partida que no se puede continuar: se registra como abandonada
function InterruptedGame({ id }) {
  const done = useRef(false);
  useEffect(() => {
    if (done.current) return;
    done.current = true;
    gameService.abandon(id).catch(() => {});
    gameSession.end(id);
  }, [id]);

  return (
    <section className="card">
      <h1>Partida interrumpida</h1>
      <Message type="info">
        La página se recargó o se abrió la partida por la dirección, así que no se puede continuar.
        Quedó registrada como abandonada.
      </Message>
      <div className="acciones detalle">
        <Link to="/" className="btn">Volver al menú</Link>
      </div>
    </section>
  );
}
