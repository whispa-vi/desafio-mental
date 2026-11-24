import { UserModel } from "../models/user.model.js";

export class UserController {
  static async getAll(req, res) {
    const users = await UserModel.getAll();
    res.json(users);
  }
}
