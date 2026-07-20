import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken";

import { createUser , findUserByEmail , findUserById } from "@/repositories/user.repository"


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
      role : user.role
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