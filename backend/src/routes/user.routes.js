import { Router } from "express";
import { Role } from "@prisma/client";
import { UserController } from "../controllers/user.controller.js";
import { authenticate } from "../middlewares/authenticate.js";
import { authorize } from "../middlewares/authorize.js";

export const userRoutes = Router();

userRoutes.get("/", authenticate, authorize(Role.ADMIN), UserController.getAll);
