import { Prisma } from "@prisma/client";
import { ZodError } from "zod";
import { env } from "../config/env.js";

export function errorMiddleware(error, req, res, next) {
  if (error instanceof ZodError) {
    return res.status(400).json({
      error: "Dados inválidos",
      details: error.flatten(),
    });
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Recurso não encontrado" });
    }

    if (error.code === "P2002") {
      return res.status(409).json({ error: "E-mail já cadastrado" });
    }

    return res.status(400).json({
      error: "Operação inválida no banco de dados",
      ...(env.nodeEnv !== "production" ? { code: error.code, meta: error.meta } : {}),
    });
  }

  if (error.statusCode) {
    return res.status(error.statusCode).json({ error: error.message });
  }

  return res.status(500).json({ error: "Erro interno do servidor" });
}
