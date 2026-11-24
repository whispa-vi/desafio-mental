import { UserModel } from "./user.model.js";
import { hashPassword, comparePassword } from "../utils/hash.js";
import { generateToken } from "../utils/jwt.js";
import { HttpError } from "../utils/httpError.js";

export class AuthModel {
  static async register({ username, email, password }) {
    if (await UserModel.getByUsername(username)) {
      throw new HttpError(409, "El nombre de usuario ya está registrado");
    }
    if (await UserModel.getByEmail(email)) {
      throw new HttpError(409, "El email ya está registrado");
    }

    const hashedPassword = await hashPassword(password);
    const user = await UserModel.create({ username, email, password: hashedPassword });
    return UserModel.toPublic(user);
  }

  static async login({ username, password }) {
    const user = await UserModel.getByUsername(username);
    if (!user || !(await comparePassword(password, user.password))) {
      throw new HttpError(401, "Usuario o contraseña incorrectos");
    }

    const token = generateToken({ id: user.id, username: user.username, role: user.role });
    return { token, user: UserModel.toPublic(user) };
  }

  static async profile(id) {
    const user = await UserModel.getById(id);
    if (!user) {
      throw new HttpError(404, "Usuario no encontrado");
    }
    return UserModel.toPublic(user);
  }
}
