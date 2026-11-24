import { prisma } from "../providers/prisma.provider.js";

export class UserModel {
  static toPublic(user) {
    const { password, ...publicUser } = user;
    return publicUser;
  }

  static async getAll() {
    const users = await prisma.user.findMany({ orderBy: { createdAt: "asc" } });
    return users.map(UserModel.toPublic);
  }

  static async getById(id) {
    return await prisma.user.findUnique({ where: { id } });
  }

  static async getByUsername(username) {
    return await prisma.user.findUnique({ where: { username } });
  }

  static async getByEmail(email) {
    return await prisma.user.findUnique({ where: { email } });
  }

  static async create(data) {
    return await prisma.user.create({ data });
  }
}
