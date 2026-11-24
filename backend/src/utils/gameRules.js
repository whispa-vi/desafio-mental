// Reglas de la partida, iguales a las del Parcial I.
export const SECONDS_PER_QUESTION = 15;
export const PAUSE_MS = 2000;
// Margen para la demora de la red: una respuesta se acepta hasta 15 s + 3 s.
export const GRACE_MS = 3000;

// Array<Question>, Number, Number -> Array<Question>
// Igual que seleccionarPreguntas del Parcial I: toma `amount` preguntas seguidas,
// empezando en `start` y volviendo al principio. Si no alcanzan, devuelve [].
export function selectQuestions(questions, amount, start) {
  if (questions.length < amount) {
    return [];
  }
  const selected = [];
  for (let i = 0; i < amount; i++) {
    selected.push(questions[(start + i) % questions.length]);
  }
  return selected;
}

// Number, Number -> Number
export function percentage(correct, total) {
  if (total === 0) {
    return 0;
  }
  return Math.floor((correct * 100) / total);
}

// Number -> String
export function messageForPercentage(value) {
  if (value < 40) {
    return "Necesitás seguir practicando";
  }
  if (value < 70) {
    return "Vas por buen camino";
  }
  if (value < 100) {
    return "¡Excelente desempeño!";
  }
  return "¡Partida perfecta!";
}
