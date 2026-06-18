import "dotenv/config";
import bcrypt from "bcryptjs";
import { prisma } from "../prisma/client.js";

const email = process.env.SEED_USER_EMAIL || "admin@example.com";
const password = process.env.SEED_USER_PASSWORD || "123456";
const name = process.env.SEED_USER_NAME || "Administrador";
const age = Number(process.env.SEED_USER_AGE || 30);

const user = await prisma.user.upsert({
  where: { email },
  update: {
    name,
    age,
    role: "admin",
    passwordHash: await bcrypt.hash(password, 12),
  },
  create: {
    email,
    name,
    age,
    role: "admin",
    passwordHash: await bcrypt.hash(password, 12),
  },
});

console.log(`Usuário seed pronto: ${user.email}`);

await prisma.$disconnect();
