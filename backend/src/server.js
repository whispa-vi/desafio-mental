import "./config/env.js";
import express from "express";
import cors from "cors";
import { authRoutes } from "./routes/auth.routes.js";
import { userRoutes } from "./routes/user.routes.js";
import { questionRoutes } from "./routes/question.routes.js";
import { gameRoutes } from "./routes/game.routes.js";
import { statsRoutes, rankingRoutes } from "./routes/stats.routes.js";
import { notFound, errorHandler } from "./middlewares/errorHandler.js";

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(cors());
app.use(express.json());

app.get("/api", (req, res) => {
  res.json({ message: "API Desafío Mental funcionando" });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/games", gameRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/ranking", rankingRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
