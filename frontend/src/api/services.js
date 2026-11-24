// Una función por cada endpoint de la API.
import { api } from "./client.js";

const query = (params) => {
  const search = new URLSearchParams(Object.entries(params).filter(([, value]) => value));
  const text = search.toString();
  return text ? `?${text}` : "";
};

export const authService = {
  register: (data) => api.post("/auth/register", data),
  login: (data) => api.post("/auth/login", data),
  profile: () => api.get("/auth/profile"),
};

export const questionService = {
  categories: () => api.get("/questions/categories"),
  list: (category) => api.get(`/questions${query({ category })}`),
  get: (id) => api.get(`/questions/${id}`),
  create: (data) => api.post("/questions", data),
  update: (id, data) => api.put(`/questions/${id}`, data),
  remove: (id) => api.delete(`/questions/${id}`),
};

export const gameService = {
  start: (category, amount) => api.post("/games", { category, amount }),
  answer: (gameId, questionId, selectedIndex) => api.post(`/games/${gameId}/answers`, { questionId, selectedIndex }),
  abandon: (gameId) => api.patch(`/games/${gameId}/abandon`),
  result: (gameId) => api.get(`/games/${gameId}`),
  history: (filters) => api.get(`/games/history${query(filters)}`),
};

export const userService = {
  list: () => api.get("/users"),
};

export const statsService = {
  me: () => api.get("/stats/me"),
  byCategory: (category) => api.get(`/stats/me/categories/${encodeURIComponent(category)}`),
  ranking: () => api.get("/ranking"),
};
