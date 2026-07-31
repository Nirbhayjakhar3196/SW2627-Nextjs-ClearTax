import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { createUser, findUserByEmail, findUserById, updateUser } from "../repositories/user.repository.js";
import { sendResetEmail } from "./email.service.js";

/**
 * Registers a new user with a hashed password.
 */
export async function signup(userData) {
  const existingUser = await findUserByEmail(userData.email);

  if (existingUser) {
    throw new Error("Email already registered");
  }

  // Hash plain text password using bcrypt with salt rounds of 10
  const hashedPassword = await bcrypt.hash(userData.password, 10);

  const newUser = await createUser({
    name: userData.name,
    email: userData.email,
    password: hashedPassword,
  });

  return newUser;
}

/**
 * Authenticates user credentials and returns a JWT access token.
 */
export async function login(userData) {
  const user = await findUserByEmail(userData.email);

  if (!user) {
    throw new Error("User not found");
  }

  // Compare submitted plain text password with stored bcrypt hash
  const isPasswordValid = await bcrypt.compare(userData.password, user.password);

  if (!isPasswordValid) {
    throw new Error("Password not valid");
  }

  // Sign JWT token containing safe payload claims (id, email, role) valid for 7 days
  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );

  return {
    token: token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      profilePicture: user.profilePicture,
    },
  };
}

/**
 * Fetches user record by ID.
 */
export async function getCurrentUser(userId) {
  const user = await findUserById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  return user;
}

/**
 * Updates profile fields (name, avatar picture, or password).
 */
export async function updateUserProfile(userId, updateData) {
  const user = await findUserById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  const prismaUpdateData = {};

  if (updateData.name !== undefined) {
    prismaUpdateData.name = updateData.name;
  }

  if (updateData.profilePicture !== undefined) {
    prismaUpdateData.profilePicture = updateData.profilePicture;
  }

  if (updateData.newPassword) {
    const dbUser = await findUserByEmail(user.email);
    const isPasswordValid = await bcrypt.compare(updateData.oldPassword, dbUser.password);
    if (!isPasswordValid) {
      throw new Error("Current password is not valid");
    }

    const hashedNewPassword = await bcrypt.hash(updateData.newPassword, 10);
    prismaUpdateData.password = hashedNewPassword;
  }

  return await updateUser(userId, prismaUpdateData);
}

// In-memory key-value map for password reset OTP codes: email -> { otp, expiresAt }
export const otpStore = new Map();

/**
 * Generates a 6-digit random OTP, saves it in memory for 10 mins, and emails it.
 */
export async function requestPasswordReset(email) {
  const user = await findUserByEmail(email);
  if (!user) {
    throw new Error("User with this email does not exist");
  }

  // Generate 6-digit OTP code string (100000 to 999999)
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes from now

  otpStore.set(email, { otp: otp, expiresAt: expiresAt });

  // Send verification code email
  await sendResetEmail(email, otp);

  return { success: true };
}

/**
 * Verifies if submitted OTP code matches stored OTP code and is not expired.
 */
export async function verifyOTP(email, otp) {
  const storedData = otpStore.get(email);
  if (!storedData) {
    throw new Error("No password reset request found for this email");
  }

  if (Date.now() > storedData.expiresAt) {
    otpStore.delete(email);
    throw new Error("Reset code has expired");
  }

  if (storedData.otp !== otp) {
    throw new Error("Invalid reset code");
  }

  return { success: true };
}

/**
 * Verifies OTP code and updates user's password in database.
 */
export async function resetPassword(email, otp, newPassword) {
  const storedData = otpStore.get(email);
  if (!storedData) {
    throw new Error("No password reset request found for this email");
  }

  if (Date.now() > storedData.expiresAt) {
    otpStore.delete(email);
    throw new Error("Reset code has expired");
  }

  if (storedData.otp !== otp) {
    throw new Error("Invalid reset code");
  }

  if (!newPassword || newPassword.length < 8) {
    throw new Error("Password must be at least 8 characters");
  }

  const user = await findUserByEmail(email);
  if (!user) {
    throw new Error("User not found");
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await updateUser(user.id, { password: hashedPassword });

  // Clean up used OTP code from memory store
  otpStore.delete(email);

  return { success: true };
}
