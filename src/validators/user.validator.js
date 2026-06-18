import { z } from "zod";

export const createUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2).max(120),
  age: z.coerce.number().int().min(0).max(120),
  password: z.string().min(6).max(128),
});

export const updateUserSchema = z.object({
  email: z.string().email().optional(),
  name: z.string().min(2).max(120).optional(),
  age: z.coerce.number().int().min(0).max(120).optional(),
  password: z.string().min(6).max(128).optional(),
});

export const updateUserRoleSchema = z.object({
  role: z.enum(["user", "admin"]),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1).max(128),
});

export function parseBody(schema) {
  return (req, res, next) => {
    try {
      req.validatedBody = schema.parse(req.body);
      next();
    } catch (error) {
      next(error);
    }
  };
}
