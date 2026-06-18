import { asyncHandler } from "../middleware/async-handler.js";
import { authenticateUser } from "../services/auth.service.js";
import { loginSchema, parseBody } from "../validators/user.validator.js";

export const login = [
  parseBody(loginSchema),
  asyncHandler(async (req, res) => {
    const result = await authenticateUser(req.validatedBody);
    res.json(result);
  }),
];
