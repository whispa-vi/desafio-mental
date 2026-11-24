import { useTimer } from "../hooks/useTimer.js";

// Segundos que quedan, en una «pastilla»; en los últimos 5 se pone roja.
export default function Countdown({ seconds, running, onExpire }) {
  const left = useTimer(seconds, { running, onExpire });
  return (
    <span className={left <= 5 ? "pill tiempo-pill urgente" : "pill tiempo-pill"} aria-label={`Quedan ${left} segundos`}>
      <span aria-hidden="true">⏱</span> 0:{String(left).padStart(2, "0")}
    </span>
  );
}
