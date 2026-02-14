import express from "express";
import {
  signupUser,
  signinUser,
  signout,
  verifyEmail,
  resendVerificationCode,
  verifyPhone,
  sendPhoneVerificationCode,
  forgotPassword,
  resetPassword,
  googleAuth,
  createUserByAdmin,
  requireAuth,
  isAdmin,
} from "../controllers/auth.controller.js";

const router = express.Router();

// Basic auth
router.post("/signup", signupUser);
router.post("/signin", signinUser);
router.get("/signout", signout);

// Email verification
router.post("/verify-email", requireAuth, verifyEmail);
router.post("/resend-verification", requireAuth, resendVerificationCode);

// Phone verification
router.post("/verify-phone", requireAuth, verifyPhone);
router.post("/send-phone-verification", requireAuth, sendPhoneVerificationCode);

// Password reset
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

// OAuth
router.post("/google", googleAuth);

// Check auth
router.get("/me", requireAuth, (req, res) => {
  res.json({ auth: req.auth });
});

// Admin
router.post("/admin/users", requireAuth, isAdmin, createUserByAdmin);

export default router;
