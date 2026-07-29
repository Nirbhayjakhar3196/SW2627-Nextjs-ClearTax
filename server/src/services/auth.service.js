import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken";

import { createUser , findUserByEmail , findUserById, updateUser } from "../repositories/user.repository.js"
import { sendResetEmail } from "./email.service.js";


export async function signup(userData){

  const existingUser = await findUserByEmail(userData.email)

  if(existingUser){
    throw new Error("Email already registered")
  }

  const hashedPassword = await bcrypt.hash(userData.password , 10)

  return createUser({
    ...userData,
    password : hashedPassword
  })
}

export async function login(userData){

  const user = await findUserByEmail(userData.email)

  if(!user){
    throw new Error("User not found")
  }

  const isPasswordValid = await bcrypt.compare(
    userData.password,
    user.password
  )

  if(!isPasswordValid){
    throw new Error("Password not valid")
  }

  const token = jwt.sign(
    {
      id : user.id,
      email:user.email,
      role : user.role
    },
    process.env.JWT_SECRET,
    {
      expiresIn:"7d"
    }
  )

  return {
    token , 
    user : {
      id : user.id,
      name : user.name,
      email:user.email,
      role : user.role,
      profilePicture : user.profilePicture
    }
  }
}

export async function getCurrentUser(userId){

  const user = await findUserById(userId)

  if(!user){
    throw new Error("User not found")
  }

  return user;
}

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
    const isPasswordValid = await bcrypt.compare(
      updateData.oldPassword,
      dbUser.password
    );
    if (!isPasswordValid) {
      throw new Error("Current password is not valid");
    }

    const hashedNewPassword = await bcrypt.hash(updateData.newPassword, 10);
    prismaUpdateData.password = hashedNewPassword;
  }

  return await updateUser(userId, prismaUpdateData);
}

// In-memory OTP store for password resets: email -> { otp, expiresAt }
export const otpStore = new Map();

export async function requestPasswordReset(email) {
  const user = await findUserByEmail(email);
  if (!user) {
    throw new Error("User with this email does not exist");
  }

  // Generate 6-digit OTP code
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

  otpStore.set(email, { otp, expiresAt });
  
  // Send email to user
  await sendResetEmail(email, otp);

  return { success: true };
}

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

  // Clean up
  otpStore.delete(email);

  return { success: true };
}