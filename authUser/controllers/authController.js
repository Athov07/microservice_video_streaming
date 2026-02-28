import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Otp from "../models/Otp.js";
import { sendOtpEmail } from "../utils/sendEmail.js";
import { generateTokens } from "../utils/generateTokens.js";
import CustomError from "../utils/customError.js";
import AuditLog from "../models/AuditLog.js";


// =========================================
// END OTP (for registration)
// =========================================
export const sendOtp = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      throw new CustomError("Email is required", 400);
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new CustomError("User already exists", 400);
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await Otp.deleteMany({ email });

    await Otp.create({
      email,
      otp,
      expiresAt: Date.now() + 5 * 60 * 1000,
    });

    await sendOtpEmail(email, otp);

    res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (error) {
    next(error);
  }
};


// =========================================
// RESEND OTP
// =========================================
export const resendOtp = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      throw new CustomError("Email is required", 400);
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await Otp.deleteMany({ email });

    await Otp.create({
      email,
      otp,
      expiresAt: Date.now() + 5 * 60 * 1000,
    });

    await sendOtpEmail(email, otp);

    res.status(200).json({
      success: true,
      message: "OTP resent successfully",
    });
  } catch (error) {
    next(error);
  }
};


// =========================================
// REGISTER WITH OTP
// =========================================
export const register = async (req, res, next) => {
  try {
    const { name, email, password, otp } = req.body;

    if (!name || !email || !password || !otp) {
      throw new CustomError("All fields are required", 400);
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new CustomError("User already exists", 400);
    }

    const otpRecord = await Otp.findOne({ email });
    if (!otpRecord) {
      throw new CustomError("OTP not found", 400);
    }

    if (otpRecord.expiresAt < Date.now()) {
      throw new CustomError("OTP expired", 400);
    }

    if (otpRecord.otp !== otp) {
      throw new CustomError("Invalid OTP", 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      isVerified: true,
    });

    await Otp.deleteMany({ email });

    const { accessToken, refreshToken } = generateTokens(user);

    user.refreshToken = refreshToken;
    await user.save();

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      accessToken,
      refreshToken,
    });
  } catch (error) {
    next(error);
  }
};


// =========================================
// LOGIN
// =========================================
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new CustomError("Email and password required", 400);
    }

    const user = await User.findOne({ email });
    if (!user) {
      throw new CustomError("Invalid credentials", 401);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new CustomError("Invalid credentials", 401);
    }

    const { accessToken, refreshToken } = generateTokens(user);

    // Save refresh token in DB
    user.refreshToken = refreshToken;
    await user.save();

    // Send user info along with tokens
    res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    next(error);
  }
};


// =========================================
// REFRESH TOKEN
// =========================================
export const refreshToken = async (req, res, next) => {
  try {
    const { token } = req.body;

    if (!token) {
      throw new CustomError("Refresh token required", 400);
    }

    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

    const user = await User.findById(decoded.id);

    if (!user || user.refreshToken !== token) {
      throw new CustomError("Invalid refresh token", 401);
    }

    const tokens = generateTokens(user);

    user.refreshToken = tokens.refreshToken;
    await user.save();

    res.status(200).json({
      success: true,
      ...tokens,
    });
  } catch (error) {
    next(error);
  }
};


// =========================================
// FORGOT PASSWORD (SEND OTP)
// =========================================
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      throw new CustomError("Email is required", 400);
    }

    const user = await User.findOne({ email });
    if (!user) {
      throw new CustomError("User not found", 404);
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await Otp.deleteMany({ email });

    await Otp.create({
      email,
      otp,
      expiresAt: Date.now() + 5 * 60 * 1000,
    });

    await sendOtpEmail(email, otp);

    res.status(200).json({
      success: true,
      message: "Password reset OTP sent",
    });
  } catch (error) {
    next(error);
  }
};


// =========================================
// RESET PASSWORD
// =========================================
export const resetPassword = async (req, res, next) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      throw new CustomError("All fields are required", 400);
    }

    const otpRecord = await Otp.findOne({ email });

    if (!otpRecord) {
      throw new CustomError("OTP not found", 400);
    }

    if (otpRecord.expiresAt < Date.now()) {
      throw new CustomError("OTP expired", 400);
    }

    if (otpRecord.otp !== otp) {
      throw new CustomError("Invalid OTP", 400);
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const user = await User.findOne({ email });
    if (!user) {
      throw new CustomError("User not found", 404);
    }

    user.password = hashedPassword;
    await user.save();

    await Otp.deleteMany({ email });

    res.status(200).json({
      success: true,
      message: "Password reset successful",
    });
  } catch (error) {
    next(error);
  }
};


// =========================================
// LOGOUT (CLEAR REFRESH TOKEN)
// =========================================
export const logout = async (req, res, next) => {
  try {
    const { token } = req.body;

    if (!token) {
      await AuditLog.create({
        action: "LOGOUT_FAILED",
        module: "AUTH",
        severity: "WARN",
        route: req.originalUrl,
        method: req.method,
        ipAddress: req.ip,
        userAgent: req.headers["user-agent"],
      });

      throw new CustomError("Refresh token required", 400);
    }

    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

    const user = await User.findById(decoded.id);

    if (user) {
      user.refreshToken = null;
      await user.save();

      // Successful Logout Log
      await AuditLog.create({
        user: user._id,
        action: "LOGOUT_SUCCESS",
        module: "AUTH",
        severity: "INFO",
        route: req.originalUrl,
        method: req.method,
        statusCode: 200,
        ipAddress: req.ip,
        userAgent: req.headers["user-agent"],
      });
    }

    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });

  } catch (error) {

    // Log Invalid Token or Error
    await AuditLog.create({
      action: "LOGOUT_ERROR",
      module: "AUTH",
      severity: "ERROR",
      route: req.originalUrl,
      method: req.method,
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"],
    });

    next(error);
  }
};


