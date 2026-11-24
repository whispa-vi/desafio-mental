import { prisma } from "../providers/prisma.provider.js";
import { menuStats, categoryStats } from "../utils/stats.js";

export class StatsModel {
  static async finishedGamesOf(userId) {
    return await prisma.game.findMany({
      where: { userId, status: { not: null } },
      include: { answers: true },
    });
  }

  static async me(userId) {
    return menuStats(await StatsModel.finishedGamesOf(userId));
  }

  static async byCategory(userId, category) {
    const games = await StatsModel.finishedGamesOf(userId);
    return { category, ...categoryStats(category)(games) };
  }

  // Top 10 de partidas completadas: puntaje ↓, duración ↑, fecha ↑ (criterios del Parcial I)
  static async ranking() {
    const games = await prisma.game.findMany({
      where: { status: "COMPLETADA" },
      orderBy: [{ score: "desc" }, { durationSec: "asc" }, { finishedAt: "asc" }],
      take: 10,
      include: { user: { select: { username: true } } },
    });
    return games.map((game, i) => ({
      position: i + 1,
      username: game.user.username,
      score: game.score,
      category: game.category,
      durationSec: game.durationSec,
      finishedAt: game.finishedAt,
    }));
  }
}
