// Estadísticas del Parcial I, adaptadas a los datos de la base.
import { percentage } from "./gameRules.js";

// Array<Function> -> Function
export const compose = (functions) => (value) => functions.reduce((result, fn) => fn(result), value);

// Array<Game> -> Array<Game>
export const onlyCompleted = (games) => games.filter((game) => game.status === "COMPLETADA");

// Array<Game> -> Array<Answer>   (cada respuesta con la categoría de su partida)
export const answersOf = (games) =>
  games.flatMap((game) => game.answers.map((answer) => ({ category: game.category, isCorrect: answer.isCorrect })));

// Array<Answer> -> Array<Answer>   (sin las preguntas que quedaron sin responder al abandonar)
export const onlyAnswered = (answers) => answers.filter((answer) => answer.isCorrect !== null);

// String -> Function
export const byCategory = (category) => (answers) => answers.filter((answer) => answer.category === category);

// Array<Answer> -> { total, correct, percentage }
export function summarizeAnswers(answers) {
  const correct = answers.filter((answer) => answer.isCorrect).length;
  return { total: answers.length, correct, percentage: percentage(correct, answers.length) };
}

// String -> Function
export const maxOf = (field) => (games) => games.reduce((max, game) => (game[field] > max ? game[field] : max), 0);

// Array<Game> -> Object   (estadísticas del menú: solo partidas completadas)
export function menuStats(games) {
  const completed = onlyCompleted(games);
  const answers = compose([answersOf, onlyAnswered, summarizeAnswers])(completed);
  return {
    completed: completed.length,
    questions: answers.total,
    percentage: answers.percentage,
    bestScore: maxOf("score")(completed),
    bestStreak: maxOf("bestStreak")(completed),
  };
}

// String -> Function   (composición: seleccionar → transformar → calcular)
export const categoryStats = (category) => compose([answersOf, onlyAnswered, byCategory(category), summarizeAnswers]);

// Array<Game> -> { completed, abandoned, score }   (recursiva, como resumirHistorial del Parcial I)
export function summarizeHistory(games) {
  if (games.length === 0) {
    return { completed: 0, abandoned: 0, score: 0 };
  }
  const [first, ...rest] = games;
  const summary = summarizeHistory(rest);
  if (first.status === "COMPLETADA") {
    return { completed: summary.completed + 1, abandoned: summary.abandoned, score: summary.score + first.score };
  }
  return { completed: summary.completed, abandoned: summary.abandoned + 1, score: summary.score };
}
