import { config } from "dotenv";

config();

const corsOrigins = (process.env.CORS_ORIGIN || "http://localhost:4200")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT || 3000),
  jwtSecret: process.env.JWT_SECRET || "dev-secret-change-me",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "8h",
  corsOrigins,
};

export function assertEnvironment() {
  if (env.nodeEnv === "production" && env.jwtSecret === "dev-secret-change-me") {
    throw new Error("JWT_SECRET is required in production");
  }
}
