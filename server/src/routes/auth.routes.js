import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { signup, login, getCurrentUser, updateUserProfile, requestPasswordReset, verifyOTP, resetPassword, otpStore } from "../services/auth.service.js";
import { signupSchema, loginSchema } from "../validations/auth.validation.js";
import { authenticateUser } from "../middleware/auth.middleware.js";

const router = express.Router();
// Multer memory storage holds uploaded avatar files temporarily in RAM buffer
const upload = multer({ storage: multer.memoryStorage() });

// POST /api/auth/signup - Register new user account
router.post("/signup", async (req, res) => {
  try {
    // 1. Validate request body against Zod signup schema
    const validateData = signupSchema.parse(req.body);

    // 2. Call auth service to create user
    const user = await signup(validateData);

    // 3. Return success response
    res.status(201).json({
      success: true,
      message: "User registered Successfully",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// POST /api/auth/login - Authenticate user and issue JWT token
router.post("/login", async (req, res) => {
  try {
    // 1. Validate credentials format using Zod
    const validateData = loginSchema.parse(req.body);

    // 2. Verify password and generate JWT token
    const result = await login(validateData);

    // 3. Return JWT token and user info
    res.json({
      success: true,
      message: "User loginned Successfully",
      token: result.token,
      user: result.user,
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message,
    });
  }
});

// GET /api/auth/me - Fetch details of currently logged-in user
router.get("/me", authenticateUser, async (req, res) => {
  try {
    const user = await getCurrentUser(req.user.id);
    res.json({
      success: true,
      user: user,
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message,
    });
  }
});

// PUT /api/auth/me - Update user name, avatar profile picture, or password
router.put("/me", authenticateUser, upload.single("profilePicture"), async (req, res) => {
  try {
    const updateData = {};

    // 1. Handle profile picture upload if file attached
    if (req.file) {
      const originalFileName = req.file.originalname;
      let extension = path.extname(originalFileName);
      if (!extension) {
        extension = ".png";
      }

      const fileName = `avatar_${req.user.id}_${Date.now()}${extension}`;
      const avatarsDir = path.join(process.cwd(), "public/avatars");

      if (!fs.existsSync(avatarsDir)) {
        fs.mkdirSync(avatarsDir, { recursive: true });
      }

      const filePath = path.join(avatarsDir, fileName);
      await fs.promises.writeFile(filePath, req.file.buffer);

      updateData.profilePicture = `/avatars/${fileName}`;
    }

    // 2. Extract name and password update fields from request body
    if (req.body.name) {
      updateData.name = req.body.name;
    }
    if (req.body.oldPassword && req.body.newPassword) {
      updateData.oldPassword = req.body.oldPassword;
      updateData.newPassword = req.body.newPassword;
    }

    // 3. Save updated fields to database via service layer
    const updatedUser = await updateUserProfile(req.user.id, updateData);
    res.json({
      success: true,
      user: updatedUser,
    });
  } catch (error) {
    console.error("PUT Profile Update Error:", error);
    res.status(400).json({
      success: false,
      message: error.message || "Failed to update profile",
    });
  }
});

// POST /api/auth/forgot-password - Request 6-digit OTP for password reset
router.post("/forgot-password", async (req, res) => {
  try {
    const email = req.body.email;
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    await requestPasswordReset(email);

    res.json({
      success: true,
      message: "Reset code generated and sent to email",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// POST /api/auth/verify-otp - Verify reset OTP code
router.post("/verify-otp", async (req, res) => {
  try {
    const email = req.body.email;
    const otp = req.body.otp;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and verification code (OTP) are required",
      });
    }

    await verifyOTP(email, otp);

    res.json({
      success: true,
      message: "Verification code verified successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// POST /api/auth/reset-password - Set new password using verified OTP code
router.post("/reset-password", async (req, res) => {
  try {
    const email = req.body.email;
    const otp = req.body.otp;
    const newPassword = req.body.newPassword;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Email, reset code (OTP), and new password are required",
      });
    }

    await resetPassword(email, otp, newPassword);

    res.json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// GET /api/auth/debug-otp - Development endpoint to view active OTP
router.get("/debug-otp", (req, res) => {
  if (process.env.NODE_ENV === "production") {
    return res.status(403).json({ success: false, message: "Forbidden" });
  }

  const email = req.query.email;
  const storedData = otpStore.get(email);

  if (!storedData) {
    return res.status(404).json({ success: false, message: "No OTP found" });
  }

  res.json({ success: true, otp: storedData.otp });
});

export default router;

