import { AuthModel } from "../models/auth.model.js";

export class AuthController {
  static async register(req, res) {
    const user = await AuthModel.register(req.body);
    res.status(201).json(user);
  }

  static async login(req, res) {
    const result = await AuthModel.login(req.body);
    res.json(result);
  }

  static async profile(req, res) {
    const user = await AuthModel.profile(req.user.id);
    res.json(user);
  }
}
