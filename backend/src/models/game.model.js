import { prisma } from "../providers/prisma.provider.js";
import { HttpError } from "../utils/httpError.js";
import {
  selectQuestions, percentage, messageForPercentage,
  SECONDS_PER_QUESTION, PAUSE_MS, GRACE_MS,
} from "../utils/gameRules.js";
import { summarizeHistory } from "../utils/stats.js";

const STATUS_FROM_QUERY = { completada: "COMPLETADA", abandonada: "ABANDONADA" };
const withAnswers = { answers: { include: { question: true }, orderBy: { order: "asc" } } };

function secondsBetween(from, to) {
  return Math.round((to - from) / 1000);
}

// La pregunta como la ve el jugador: SIN la respuesta correcta.
function toPlayerQuestion(answer, total) {
  return {
    questionId: answer.question.id,
    order: answer.order,
    total,
    statement: answer.question.statement,
    options: answer.question.options,
    points: answer.question.points,
    seconds: SECONDS_PER_QUESTION,
  };
}

function toSummary(game) {
  return {
    id: game.id,
    category: game.category,
    status: game.status ? game.status.toLowerCase() : "en curso",
    score: game.score,
    correct: game.correct,
    wrong: game.wrong,
    totalQuestions: game.totalQuestions,
    finishedAt: game.finishedAt,
  };
}

export class GameModel {
  // Partida del usuario o 404 (no se revela si existe una partida de otro usuario)
  static async findOwn(userId, gameId) {
    const game = await prisma.game.findUnique({ where: { id: gameId }, include: withAnswers });
    if (!game || game.userId !== userId) {
      throw new HttpError(404, "Partida no encontrada");
    }
    return game;
  }

  // Como en el Parcial I: una partida sin terminar queda registrada como abandonada
  static async abandonUnfinished(userId) {
    const unfinished = await prisma.game.findMany({ where: { userId, status: null } });
    const now = new Date();
    for (const game of unfinished) {
      await prisma.game.update({
        where: { id: game.id },
        data: { status: "ABANDONADA", finishedAt: now, durationSec: secondsBetween(game.startedAt, now) },
      });
    }
  }

  static async start(userId, { category, amount }) {
    const questions = await prisma.question.findMany({
      where: { category, active: true },
      orderBy: { id: "asc" },
    });
    const played = await prisma.game.count({ where: { userId, category } });
    const selected = selectQuestions(questions, amount, played);

    if (selected.length === 0) {
      throw new HttpError(409, `No hay suficientes preguntas de "${category}" para una partida de ${amount} preguntas`);
    }

    await GameModel.abandonUnfinished(userId);

    const now = new Date();
    const game = await prisma.game.create({
      data: {
        userId,
        category,
        totalQuestions: amount,
        startedAt: now,
        answers: {
          create: selected.map((question, i) => ({
            questionId: question.id,
            order: i + 1,
            shownAt: i === 0 ? now : null,
          })),
        },
      },
      include: withAnswers,
    });

    return { ...toSummary(game), question: toPlayerQuestion(game.answers[0], amount) };
  }

  static async answer(userId, gameId, { questionId, selectedIndex }) {
    const game = await GameModel.findOwn(userId, gameId);
    if (game.status) {
      throw new HttpError(409, "La partida ya terminó");
    }

    const current = game.answers.find((answer) => answer.isCorrect === null);
    if (current.questionId !== questionId) {
      throw new HttpError(409, "Esa no es la pregunta actual de la partida");
    }

    const now = new Date();
    const late = current.shownAt && now - current.shownAt > SECONDS_PER_QUESTION * 1000 + GRACE_MS;
    const timedOut = selectedIndex === null || Boolean(late);
    const isCorrect = !timedOut && selectedIndex === current.question.correctIndex;
    const points = isCorrect ? current.question.points : 0;
    const currentStreak = isCorrect ? game.currentStreak + 1 : 0;
    const bestStreak = Math.max(game.bestStreak, currentStreak);
    const next = game.answers.find((answer) => answer.order === current.order + 1);

    const gameData = {
      score: game.score + points,
      correct: game.correct + (isCorrect ? 1 : 0),
      wrong: game.wrong + (isCorrect ? 0 : 1),
      currentStreak,
      bestStreak,
    };
    if (!next) {
      Object.assign(gameData, { status: "COMPLETADA", finishedAt: now, durationSec: secondsBetween(game.startedAt, now) });
    }

    await prisma.$transaction(async (tx) => {
      const saved = await tx.gameAnswer.updateMany({
        where: { id: current.id, isCorrect: null },
        data: { selectedIndex: timedOut ? null : selectedIndex, isCorrect, points, answeredAt: now },
      });
      if (saved.count === 0) {
        throw new HttpError(409, "Esa pregunta ya fue respondida");
      }
      await tx.game.update({ where: { id: game.id }, data: gameData });
      if (next) {
        await tx.gameAnswer.update({
          where: { id: next.id },
          data: { shownAt: new Date(now.getTime() + PAUSE_MS) },
        });
      }
    });

    return {
      isCorrect,
      timedOut,
      correctIndex: current.question.correctIndex,
      pointsEarned: points,
      score: gameData.score,
      correct: gameData.correct,
      wrong: gameData.wrong,
      currentStreak,
      bestStreak,
      finished: !next,
      next: next ? toPlayerQuestion(next, game.totalQuestions) : null,
    };
  }

  static async abandon(userId, gameId) {
    const game = await GameModel.findOwn(userId, gameId);
    if (game.status) {
      throw new HttpError(409, "La partida ya terminó");
    }
    const now = new Date();
    const updated = await prisma.game.update({
      where: { id: game.id },
      data: { status: "ABANDONADA", finishedAt: now, durationSec: secondsBetween(game.startedAt, now) },
    });
    return toSummary(updated);
  }

  static async getResult(userId, gameId) {
    const game = await GameModel.findOwn(userId, gameId);
    if (!game.status) {
      throw new HttpError(409, "La partida todavía está en curso");
    }
    const value = percentage(game.correct, game.totalQuestions);
    return {
      ...toSummary(game),
      percentage: value,
      message: messageForPercentage(value),
      bestStreak: game.bestStreak,
      durationSec: game.durationSec,
      answers: game.answers
        .filter((answer) => answer.isCorrect !== null)
        .map((answer) => ({
          order: answer.order,
          statement: answer.question.statement,
          options: answer.question.options,
          selectedIndex: answer.selectedIndex,
          correctIndex: answer.question.correctIndex,
          isCorrect: answer.isCorrect,
          points: answer.points,
          // Segundos que tardó en responder (desde que se mostró la pregunta)
          seconds: answer.shownAt && answer.answeredAt
            ? Math.max(0, Math.round((answer.answeredAt - answer.shownAt) / 100) / 10)
            : null,
        })),
    };
  }

  static async history(userId, { category, status }) {
    if (status && !STATUS_FROM_QUERY[status]) {
      throw new HttpError(400, "El estado debe ser completada o abandonada");
    }
    const finished = await prisma.game.findMany({
      where: { userId, status: { not: null } },
      orderBy: { finishedAt: "desc" },
    });
    const games = finished
      .filter((game) => !category || game.category === category)
      .filter((game) => !status || game.status === STATUS_FROM_QUERY[status]);

    return { summary: summarizeHistory(finished), games: games.map(toSummary) };
  }
}
