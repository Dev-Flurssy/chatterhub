import mongoose from "mongoose";
import bcrypt from "bcrypt";
import validator from "validator";
import dayjs from "dayjs";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, required: "Name is required" },
    username: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
      lowercase: true,
      minlength: 3,
      maxlength: 30,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: "Email already exists",
      required: "Email is required",
      validate: {
        validator: (v) => validator.isEmail(v),
        message: "Please enter a valid email address",
      },
    },
    phone: {
      type: String,
      trim: true,
      sparse: true,
      validate: {
        validator: function(v) {
          if (!v) return true; // Allow empty
          // Remove spaces, dashes, parentheses for validation
          const cleaned = v.replace(/[\s\-\(\)]/g, '');
          // Check if it starts with + and has 10-15 digits
          return /^\+?\d{10,15}$/.test(cleaned);
        },
        message: "Please enter a valid phone number (e.g., +2305833177 or +1234567890)",
      },
    },
    hashed_password: {
      type: String,
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    status: {
      type: String,
      enum: ["active", "suspended"],
      default: "active",
    },
    about: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    profilePic: {
      type: String,
      default: function () {
        return Math.random() > 0.5
          ? "/uploads/chatter-male-1.png"
          : "/uploads/chatter-female-1.png";
      },
    },
    // Verification fields
    emailVerified: { type: Boolean, default: false },
    phoneVerified: { type: Boolean, default: false },
    verificationToken: String,
    verificationTokenExpiry: Date,
    verificationCode: String,
    verificationCodeExpiry: Date,
    // OAuth fields
    authProvider: {
      type: String,
      enum: ["local", "google", "apple"],
      default: "local",
    },
    googleId: String,
    appleId: String,
    // Password reset
    resetToken: String,
    resetTokenExpiry: Date,
    // Social
    following: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
    followers: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
    // Analytics
    analytics: {
      signupDate: { type: Date, default: Date.now },
      lastActive: { type: Date, default: Date.now },
      totalSessions: { type: Number, default: 0 },
      totalPageViews: { type: Number, default: 0 }
    }
  },
  { timestamps: true }
);

userSchema.methods.authenticate = async function (plainText) {
  return await bcrypt.compare(plainText, this.hashed_password);
};

userSchema.methods.formatDates = function () {
  return {
    createdAt: dayjs(this.createdAt).format("YYYY-MM-DD HH:mm:ss"),
    updatedAt: dayjs(this.updatedAt).format("YYYY-MM-DD HH:mm:ss"),
  };
};

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.hashed_password;
  delete obj.resetToken;
  delete obj.resetTokenExpiry;
  delete obj.verificationToken;
  delete obj.verificationTokenExpiry;
  delete obj.verificationCode;
  delete obj.verificationCodeExpiry;
  delete obj.googleId;
  delete obj.appleId;
  return obj;
};

userSchema.statics.signup = async function (
  name,
  email,
  password,
  role = "user",
  username = null,
  phone = null
) {
  try {
    const exists = await this.findOne({ email });
    if (exists) throw new Error("Email already registered");

    if (username) {
      const usernameExists = await this.findOne({ username });
      if (usernameExists) throw new Error("Username already taken");
    }

    if (phone) {
      const phoneExists = await this.findOne({ phone });
      if (phoneExists) throw new Error("Phone number already registered");
    }

    if (
      !validator.isStrongPassword(password, {
        minLength: 6,
        minLowercase: 1,
        minNumbers: 1,
        minSymbols: 0,
        minUppercase: 0,
      })
    ) {
      throw new Error(
        "Password must be at least 6 characters and contain at least 1 number"
      );
    }

    const hashed_password = await bcrypt.hash(password, 10);

    return await this.create({
      name,
      email,
      hashed_password,
      role,
      username,
      phone,
    });
  } catch (err) {
    if (err.code === 11000) {
      if (err.keyPattern?.email) throw new Error("Email already registered");
      if (err.keyPattern?.username) throw new Error("Username already taken");
      if (err.keyPattern?.phone) throw new Error("Phone number already registered");
    }
    throw err;
  }
};

userSchema.statics.signin = async function (email, password) {
  const user = await this.findOne({ email });
  if (!user) throw new Error("Incorrect email or password");

  const match = await bcrypt.compare(password, user.hashed_password);
  if (!match) throw new Error("Incorrect email or password");

  if (user.status !== "active") {
    throw new Error("Account is suspended. Contact support.");
  }

  return user;
};

export default mongoose.model("User", userSchema);
