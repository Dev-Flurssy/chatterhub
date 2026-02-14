import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../models/user.model.js";
import errorHandler from "../helpers/dbErrorHandler.js";
import sessionService from "../services/sessionService.js";
import emailService from "../services/emailService.js";
import { trackEvent, getSessionId } from "../middleware/analytics.middleware.js";

const createToken = (user) => {
  return jwt.sign({ _id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// Signup with email/phone verification
const signupUser = async (req, res) => {
  const { name, email, password, username, phone } = req.body;
  try {
    const user = await User.signup(name, email, password, "user", username, phone);
    
    // Generate verification code
    const verificationCode = emailService.generateVerificationCode();
    user.verificationCode = verificationCode;
    user.verificationCodeExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    // Send verification email
    const emailResult = await emailService.sendVerificationEmail(email, verificationCode, name);

    const token = createToken(user);

    // Track signup event
    const sessionId = getSessionId(req);
    trackEvent('signup', user._id, sessionId, { email: user.email, username: user.username });

    res.status(201).json({
      message: "Signup successful. Please verify your email.",
      user: {
        _id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        phone: user.phone,
        emailVerified: user.emailVerified,
        phoneVerified: user.phoneVerified,
        role: user.role,
        createdAt: user.createdAt,
      },
      token,
      devMode: emailResult.devMode,
      verificationCode: emailResult.devMode ? emailResult.code : undefined,
    });
  } catch (err) {
    res
      .status(400)
      .json({ error: err.message || errorHandler.getErrorMessage(err) });
  }
};

// Verify email with code
const verifyEmail = async (req, res) => {
  const { code } = req.body;
  try {
    const user = await User.findById(req.auth._id);
    if (!user) throw new Error("User not found");

    if (user.emailVerified) {
      return res.json({ message: "Email already verified" });
    }

    if (!user.verificationCode || user.verificationCodeExpiry < Date.now()) {
      throw new Error("Verification code expired. Please request a new one.");
    }

    if (user.verificationCode !== code) {
      throw new Error("Invalid verification code");
    }

    user.emailVerified = true;
    user.verificationCode = undefined;
    user.verificationCodeExpiry = undefined;
    await user.save();

    res.json({ message: "Email verified successfully", emailVerified: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Resend verification code
const resendVerificationCode = async (req, res) => {
  try {
    const user = await User.findById(req.auth._id);
    if (!user) throw new Error("User not found");

    if (user.emailVerified) {
      return res.json({ message: "Email already verified" });
    }

    const verificationCode = emailService.generateVerificationCode();
    user.verificationCode = verificationCode;
    user.verificationCodeExpiry = Date.now() + 10 * 60 * 1000;
    await user.save();

    const emailResult = await emailService.sendVerificationEmail(user.email, verificationCode, user.name);

    res.json({ 
      message: "Verification code sent",
      devMode: emailResult.devMode,
      verificationCode: emailResult.devMode ? emailResult.code : undefined,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Verify phone with code
const verifyPhone = async (req, res) => {
  const { code } = req.body;
  try {
    const user = await User.findById(req.auth._id);
    if (!user) throw new Error("User not found");

    if (!user.phone) throw new Error("No phone number registered");

    if (user.phoneVerified) {
      return res.json({ message: "Phone already verified" });
    }

    if (!user.verificationCode || user.verificationCodeExpiry < Date.now()) {
      throw new Error("Verification code expired. Please request a new one.");
    }

    if (user.verificationCode !== code) {
      throw new Error("Invalid verification code");
    }

    user.phoneVerified = true;
    user.verificationCode = undefined;
    user.verificationCodeExpiry = undefined;
    await user.save();

    res.json({ message: "Phone verified successfully", phoneVerified: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Send phone verification code
const sendPhoneVerificationCode = async (req, res) => {
  try {
    const user = await User.findById(req.auth._id);
    if (!user) throw new Error("User not found");

    if (!user.phone) throw new Error("No phone number registered");

    if (user.phoneVerified) {
      return res.json({ message: "Phone already verified" });
    }

    const verificationCode = emailService.generateVerificationCode();
    user.verificationCode = verificationCode;
    user.verificationCodeExpiry = Date.now() + 10 * 60 * 1000;
    await user.save();

    const smsResult = await emailService.sendPhoneVerification(user.phone, verificationCode);

    res.json({ 
      message: "Verification code sent to your phone",
      devMode: smsResult.devMode,
      verificationCode: smsResult.devMode ? smsResult.code : undefined,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Signin
const signinUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.signin(email, password);
    const token = createToken(user);

    res.cookie("t", token, { httpOnly: true, sameSite: "strict" });

    // Start analytics session
    const sessionId = getSessionId(req);
    await sessionService.startSession(sessionId, user._id);

    return res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        phone: user.phone,
        emailVerified: user.emailVerified,
        phoneVerified: user.phoneVerified,
        profilePic: user.profilePic,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    return res.status(400).json({ error: err.message || "Could not sign in" });
  }
};

// Forgot password - send reset email
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      // Don't reveal if email exists
      return res.json({ message: "If that email exists, a reset link has been sent." });
    }

    const resetToken = emailService.generateToken();
    user.resetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetTokenExpiry = Date.now() + 60 * 60 * 1000; // 1 hour
    await user.save();

    const emailResult = await emailService.sendPasswordResetEmail(user.email, resetToken, user.name);

    res.json({ 
      message: "Password reset link sent to your email",
      devMode: emailResult.devMode,
      resetToken: emailResult.devMode ? resetToken : undefined,
      resetUrl: emailResult.devMode ? emailResult.resetUrl : undefined,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Reset password with token
const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;
  try {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    
    const user = await User.findOne({
      resetToken: hashedToken,
      resetTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      throw new Error("Invalid or expired reset token");
    }

    // Validate new password
    const validator = await import('validator');
    if (!validator.default.isStrongPassword(newPassword, {
      minLength: 6,
      minLowercase: 1,
      minNumbers: 1,
      minSymbols: 0,
      minUppercase: 0,
    })) {
      throw new Error("Password must be at least 6 characters and contain at least 1 number");
    }

    const bcrypt = await import('bcrypt');
    user.hashed_password = await bcrypt.default.hash(newPassword, 10);
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    res.json({ message: "Password reset successful. You can now sign in." });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// OAuth - Google Sign In
const googleAuth = async (req, res) => {
  const { googleId, email, name, profilePic } = req.body;
  try {
    let user = await User.findOne({ googleId });
    
    if (!user) {
      user = await User.findOne({ email });
      if (user) {
        // Link Google account to existing user
        user.googleId = googleId;
        user.authProvider = 'google';
        user.emailVerified = true; // Google emails are verified
        if (profilePic) user.profilePic = profilePic;
        await user.save();
      } else {
        // Create new user with auto-generated username
        const baseUsername = email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '');
        let username = baseUsername;
        let counter = 1;
        
        // Ensure unique username
        while (await User.findOne({ username })) {
          username = `${baseUsername}${counter}`;
          counter++;
        }

        user = await User.create({
          name,
          email,
          username,
          googleId,
          authProvider: 'google',
          emailVerified: true,
          profilePic: profilePic || undefined,
          hashed_password: crypto.randomBytes(32).toString('hex'), // Random password
        });
      }
    }

    const token = createToken(user);
    const sessionId = getSessionId(req);
    await sessionService.startSession(sessionId, user._id);

    res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        emailVerified: user.emailVerified,
        profilePic: user.profilePic,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Signout
const signout = async (req, res) => {
  const sessionId = getSessionId(req);
  try {
    await sessionService.endSession(sessionId);
  } catch (error) {
    console.error('Error ending session:', error.message);
  }

  res.clearCookie("t");
  return res.json({ message: "Signed out successfully" });
};

// Create user by admin
const createUserByAdmin = async (req, res) => {
  const { name, email, password, role, username, phone } = req.body;
  try {
    const user = await User.signup(name, email, password, role || "user", username, phone);
    res.status(201).json({
      message: "User created successfully",
      user: {
        _id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (err) {
    res
      .status(400)
      .json({ error: err.message || errorHandler.getErrorMessage(err) });
  }
};

// Middleware - Require authentication
const requireAuth = (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies?.t) {
      token = req.cookies.t;
    }

    if (!token) {
      return res.status(401).json({ error: "Authorization required" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.auth = decoded;
    req.userRole = decoded.role;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

// Middleware - Check authorization
const hasAuthorization = (req, res, next) => {
  const authorized =
    req.profile && req.auth && req.profile._id.toString() === req.auth._id;
  if (!authorized) {
    return res.status(403).json({ error: "User is not authorized" });
  }
  next();
};

// Middleware - Check admin role
const isAdmin = (req, res, next) => {
  if (!req.auth || req.auth.role !== "admin") {
    return res.status(403).json({ error: "Admin access required" });
  }
  next();
};

export {
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
  hasAuthorization,
  isAdmin,
  createToken,
};
