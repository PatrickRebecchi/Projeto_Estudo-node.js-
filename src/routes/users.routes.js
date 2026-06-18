import { Router } from "express";
import {
  createUser,
  deleteUser,
  getUser,
  getUsers,
  updateUser,
  updateUserRoleController,
} from "../controllers/user.controller.js";
import { adminMiddleware, authMiddleware } from "../middleware/auth.middleware.js";

export const usersRoutes = Router();

usersRoutes.use(authMiddleware);
usersRoutes.get("/", getUsers);
usersRoutes.get("/:id", getUser);
usersRoutes.patch("/:id/role", adminMiddleware, updateUserRoleController);
usersRoutes.post("/", adminMiddleware, createUser);
usersRoutes.put("/:id", adminMiddleware, updateUser);
usersRoutes.delete("/:id", adminMiddleware, deleteUser);
