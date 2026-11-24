import { prisma } from "../providers/prisma.provider.js";
import { HttpError } from "../utils/httpError.js";

export class QuestionModel {
  static async getCategories() {
    const groups = await prisma.question.groupBy({
      by: ["category"],
      where: { active: true },
      _count: { _all: true },
      orderBy: { category: "asc" },
    });
    return groups.map((g) => ({ category: g.category, count: g._count._all }));
  }

  static async getAll({ category } = {}) {
    return await prisma.question.findMany({
      where: { active: true, ...(category ? { category } : {}) },
      orderBy: [{ category: "asc" }, { statement: "asc" }],
    });
  }

  static async getById(id) {
    const question = await prisma.question.findFirst({ where: { id, active: true } });
    if (!question) {
      throw new HttpError(404, "Pregunta no encontrada");
    }
    return question;
  }

  static async create(data) {
    return await prisma.question.create({ data });
  }

  static async update(id, data) {
    await QuestionModel.getById(id);
    return await prisma.question.update({ where: { id }, data });
  }

  static async remove(id) {
    await QuestionModel.getById(id);
    await prisma.question.update({ where: { id }, data: { active: false } });
  }
}
