import { prisma } from "../prisma/client.js";

const userSelect = {
  id: true,
  email: true,
  name: true,
  age: true,
  role: true,
  createdAt: true,
  updatedAt: true,
};

export async function listUsers() {
  return prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: userSelect,
  });
}

export async function getUserById(id) {
  return prisma.user.findUniqueOrThrow({
    where: { id },
    select: userSelect,
  });
}

export async function createUser(data) {
  return prisma.user.create({
    data: {
      email: data.email,
      name: data.name,
      age: data.age,
      role: data.role || "user",
      passwordHash: data.passwordHash,
    },
    select: userSelect,
  });
}

export async function updateUser(id, data) {
  return prisma.user.update({
    where: { id },
    data,
    select: userSelect,
  });
}

export async function deleteUser(id) {
  return prisma.user.delete({
    where: { id },
  });
}
