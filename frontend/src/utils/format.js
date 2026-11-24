// Number -> String   (igual que formatearDuracion del Parcial I)
export function formatDuration(seconds) {
  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;
  return minutes === 0 ? `${rest} s` : `${minutes} min ${rest} s`;
}

// String (fecha ISO) -> String
export function formatDate(iso) {
  return iso ? new Date(iso).toLocaleString("es-AR") : "";
}
