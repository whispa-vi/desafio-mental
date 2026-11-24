import { StatsModel } from "../models/stats.model.js";

export class StatsController {
  static async me(req, res) {
    res.json(await StatsModel.me(req.user.id));
  }

  static async byCategory(req, res) {
    res.json(await StatsModel.byCategory(req.user.id, req.params.category));
  }

  static async ranking(req, res) {
    res.json(await StatsModel.ranking());
  }
}
