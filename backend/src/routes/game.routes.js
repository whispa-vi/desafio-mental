import { Router } from "express";
import { GameController } from "../controllers/game.controller.js";
import { authenticate } from "../middlewares/authenticate.js";
import { validate } from "../middlewares/validate.js";
import { startGameSchema, answerSchema } from "../dtos/game.dto.js";

export const gameRoutes = Router();

// Todas las rutas de partidas necesitan sesión; cada usuario ve solo sus partidas.
gameRoutes.post("/", authenticate, validate(startGameSchema), GameController.start);
gameRoutes.get("/history", authenticate, GameController.history);
gameRoutes.get("/:id", authenticate, GameController.getResult);
gameRoutes.post("/:id/answers", authenticate, validate(answerSchema), GameController.answer);
gameRoutes.patch("/:id/abandon", authenticate, GameController.abandon);
