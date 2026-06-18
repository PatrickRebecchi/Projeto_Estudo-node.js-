import { asyncHandler } from "../middleware/async-handler.js";
import {
  createUserWithPassword,
  updateUserRole,
  updateUserWithPassword,
} from "../services/auth.service.js";
import {
  deleteUser as deleteUserFromService,
  getUserById,
  listUsers,
} from "../services/user.service.js";
import {
  createUserSchema,
  parseBody,
  updateUserRoleSchema,
  updateUserSchema,
} from "../validators/user.validator.js";

export const getUsers = asyncHandler(async (req, res) => {
  const users = await listUsers();
  res.json(users);
});

export const getUser = asyncHandler(async (req, res) => {
  const user = await getUserById(req.params.id);
  res.json(user);
});

export const createUser = [
  parseBody(createUserSchema),
  asyncHandler(async (req, res) => {
    const user = await createUserWithPassword(req.validatedBody);
    res.status(201).json(user);
  }),
];

export const updateUser = [
  parseBody(updateUserSchema),
  asyncHandler(async (req, res) => {
    const user = await updateUserWithPassword(req.params.id, req.validatedBody);
    res.json(user);
  }),
];

export const updateUserRoleController = [
  parseBody(updateUserRoleSchema),
  asyncHandler(async (req, res) => {
    const user = await updateUserRole(req.params.id, req.validatedBody.role);
    res.json(user);
  }),
];

export const deleteUser = asyncHandler(async (req, res) => {
  await deleteUserFromService(req.params.id);
  res.status(204).send();
});
