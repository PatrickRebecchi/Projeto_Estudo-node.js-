import { asyncHandler } from "../middleware/async-handler.js";
import { authenticateUser, registerUser } from "../services/auth.service.js";
import { createUserSchema, loginSchema, parseBody } from "../validators/user.validator.js";

export const login = [
  parseBody(loginSchema),
  asyncHandler(async (req, res) => {
    const result = await authenticateUser(req.validatedBody);
    res.json(result);
  }),
];

export const register = [
  parseBody(createUserSchema),
  asyncHandler(async (req, res) => {
    const user = await registerUser(req.validatedBody);
    res.status(201).json(user);
  }),
];
