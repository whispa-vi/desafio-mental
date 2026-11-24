import { GameModel } from "../models/game.model.js";

export class GameController {
  static async start(req, res) {
    const game = await GameModel.start(req.user.id, req.body);
    res.status(201).json(game);
  }

  static async answer(req, res) {
    const result = await GameModel.answer(req.user.id, req.params.id, req.body);
    res.json(result);
  }

  static async abandon(req, res) {
    const game = await GameModel.abandon(req.user.id, req.params.id);
    res.json(game);
  }

  static async getResult(req, res) {
    const result = await GameModel.getResult(req.user.id, req.params.id);
    res.json(result);
  }

  static async history(req, res) {
    const { category, status } = req.query;
    const history = await GameModel.history(req.user.id, { category, status });
    res.json(history);
  }
}
