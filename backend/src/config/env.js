// Carga las variables de backend/.env en process.env.
// Este archivo se importa PRIMERO en server.js.
process.loadEnvFile();

if (!process.env.JWT_SECRET) {
  throw new Error("Falta JWT_SECRET en el archivo .env");
}
