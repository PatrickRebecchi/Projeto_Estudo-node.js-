import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { prisma } from "../prisma/client.js";
import { createUser, updateUser } from "./user.service.js";

const userAuthSelect = {
  id: true,
  email: true,
  name: true,
  age: true,
  role: true,
  passwordHash: true,
  createdAt: true,
  updatedAt: true,
};

export function signAccessToken(user) {
  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
      role: user.role,
    },
    env.jwtSecret,
    {
      expiresIn: env.jwtExpiresIn,
    },
  );
}

export async function authenticateUser({ email, password }) {
  const user = await prisma.user.findUnique({
    where: { email },
    select: userAuthSelect,
  });

  if (!user) {
    throw Object.assign(new Error("E-mail ou senha inválidos"), { statusCode: 401 });
  }

  const validPassword = user.passwordHash && (await bcrypt.compare(password, user.passwordHash));

  if (!validPassword) {
    throw Object.assign(new Error("E-mail ou senha inválidos"), { statusCode: 401 });
  }

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      age: user.age,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    },
    token: signAccessToken(user),
  };
}

export async function createUserWithPassword(data) {
  const passwordHash = await bcrypt.hash(data.password, 12);

  try {
    return await createUser({
      email: data.email,
      name: data.name,
      age: data.age,
      passwordHash,
    });
  } catch (error) {
    if (error?.code === "P2002") {
      throw Object.assign(new Error("E-mail já cadastrado"), { statusCode: 409 });
    }

    throw error;
  }
}

export async function updateUserWithPassword(id, data) {
  const { password, ...rest } = data;
  const updateData = {
    ...rest,
    ...(password ? { passwordHash: await bcrypt.hash(password, 12) } : {}),
  };

  return updateUser(id, updateData);
}

export async function updateUserRole(id, role) {
  return updateUser(id, { role });
}
