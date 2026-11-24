// Barra de progreso (0–100). tone: verde, rojo, marron o vacío (oscuro).
export default function ProgressBar({ value, tone = "", label }) {
  const width = Math.max(0, Math.min(100, value));
  return (
    <div className="barra" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(width)} aria-label={label}>
      <div className={`barra-relleno ${tone}`} style={{ width: `${width}%` }} />
    </div>
  );
}
