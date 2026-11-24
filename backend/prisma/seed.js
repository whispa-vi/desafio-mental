import { PrismaClient } from "@prisma/client";
 import bcrypt from "bcrypt";
 import { PREGUNTAS_INICIALES } from "./data/preguntas.js";

 const prisma = new PrismaClient();

 async function main() {
   for (const p of PREGUNTAS_INICIALES) {
     const data = {
       category: p.categoria,
       statement: p.enunciado,
       options: p.opciones,
       correctIndex: p.correcta,
       points: p.puntaje,
     };
     await prisma.question.upsert({ where: { id: p.id }, update: data, create: { id: p.id, ...data } });
   }

   const password = await bcrypt.hash("Admin1234", 10);
   await prisma.user.upsert({
     where: { username: "admin" },
     update: {},
     create: { username: "admin", email: "admin@desafio.com", password, role: "ADMIN" },
   });
 }

 main()
   .then(() => console.log("Seed OK"))
   .catch((e) => { console.error(e); process.exit(1); })
   .finally(() => prisma.$disconnect());