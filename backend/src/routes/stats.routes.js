import { Router } from "express";
import { StatsController } from "../controllers/stats.controller.js";
import { authenticate } from "../middlewares/authenticate.js";

export const statsRoutes = Router();
statsRoutes.get("/me", authenticate, StatsController.me);
statsRoutes.get("/me/categories/:category", authenticate, StatsController.byCategory);

export const rankingRoutes = Router();
rankingRoutes.get("/", authenticate, StatsController.ranking);
