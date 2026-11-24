import { Router } from "express";
import { Role } from "@prisma/client";
import { QuestionController } from "../controllers/question.controller.js";
import { authenticate } from "../middlewares/authenticate.js";
import { authorize } from "../middlewares/authorize.js";
import { validate } from "../middlewares/validate.js";
import { createQuestionSchema, updateQuestionSchema } from "../dtos/question.dto.js";

export const questionRoutes = Router();

const onlyAdmin = [authenticate, authorize(Role.ADMIN)];

// Cualquier usuario con sesión: categorías y cantidad de preguntas
questionRoutes.get("/categories", authenticate, QuestionController.getCategories);

// Solo ADMIN: gestión del banco de preguntas
questionRoutes.get("/", onlyAdmin, QuestionController.getAll);
questionRoutes.get("/:id", onlyAdmin, QuestionController.getById);
questionRoutes.post("/", onlyAdmin, validate(createQuestionSchema), QuestionController.create);
questionRoutes.put("/:id", onlyAdmin, validate(updateQuestionSchema), QuestionController.update);
questionRoutes.delete("/:id", onlyAdmin, QuestionController.remove);
