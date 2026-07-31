import { prisma } from "../config/prisma.js";

/**
 * Inserts a new user record into the database.
 */
export async function createUser(userData) {
  return await prisma.user.create({
    data: userData,
  });
}

/**
 * Searches for a user by email address.
 */
export async function findUserByEmail(email) {
  return await prisma.user.findUnique({
    where: {
      email: email,
    },
  });
}

/**
 * Searches for a user by unique ID and selects safe fields (excluding password hash).
 */
export async function findUserById(id) {
  return await prisma.user.findUnique({
    where: {
      id: parseInt(id),
    },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      profilePicture: true,
      createdAt: true,
    },
  });
}

/**
 * Updates user profile details in the database by user ID.
 */
export async function updateUser(id, data) {
  return await prisma.user.update({
    where: {
      id: parseInt(id),
    },
    data: data,
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      profilePicture: true,
      createdAt: true,
    },
  });
}