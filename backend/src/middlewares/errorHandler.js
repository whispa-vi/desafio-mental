import { HttpError } from "../utils/httpError.js";

export function notFound(req, res) {
  res.status(404).json({ message: `Ruta no encontrada: ${req.method} ${req.originalUrl}` });
}

export function errorHandler(err, req, res, next) {
  if (err instanceof HttpError) {
    return res.status(err.status).json({ message: err.message });
  }
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ message: "El cuerpo de la petición no es un JSON válido" });
  }
  if (err.code === "P2002") {
    return res.status(409).json({ message: "Ya existe un registro con esos datos" });
  }
  if (err.code === "P2025") {
    return res.status(404).json({ message: "Recurso no encontrado" });
  }
  if (err.code === "P2003") {
    return res.status(409).json({ message: "El recurso está en uso y no se puede eliminar" });
  }

  console.error(err);
  res.status(500).json({ message: "Error interno del servidor" });
}
