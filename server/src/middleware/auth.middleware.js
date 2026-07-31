import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

/**
 * Helper function to verify JWT token from a Web standard Request headers object.
 */
export async function verifyToken(request) {
  try {
    const authHeader = request.headers.get("authorization");

    if (!authHeader) {
      throw new Error("Authorization header missing");
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, env.JWT_SECRET);
    return decoded;
  } catch (err) {
    throw new Error("Invalid Token");
  }
}

/**
 * Helper function to verify JWT token from Express request headers.
 */
export async function verifyTokenExpress(req) {
  const authHeader = req.headers.authorization || req.headers["authorization"];

  if (!authHeader) {
    throw new Error("Authorization header missing");
  }

  // Header format: "Bearer <token>"
  const tokenParts = authHeader.split(" ");
  const token = tokenParts[1];

  if (!token) {
    throw new Error("Token missing from authorization header");
  }

  const decoded = jwt.verify(token, env.JWT_SECRET);
  return decoded;
}

/**
 * Express Middleware to protect private routes.
 * Verifies JWT token in incoming requests and attaches user payload to req.user.
 */
export async function authenticateUser(req, res, next) {
  try {
    const decoded = await verifyTokenExpress(req);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message || "Unauthorized: Invalid or expired token",
    });
  }
}