// Partidas iniciadas en esta pestaña. Vive en memoria: al recargar la página se vacía,
// y la partida en curso queda abandonada (mismo comportamiento que el Parcial I).
const activeGames = new Set();

export const gameSession = {
  start: (id) => activeGames.add(id),
  isActive: (id) => activeGames.has(id),
  end: (id) => activeGames.delete(id),
};
