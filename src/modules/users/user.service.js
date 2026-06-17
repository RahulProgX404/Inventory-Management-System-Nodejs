import { StatusCodes } from "http-status-codes";

import User from "./user.model.js";
import { AppError } from "../../utils/app-error.js";
import { hashPassword, comparePassword } from "../../utils/crypto.js";
import { signJWT } from "../../middlewares/jwt.middleware.js";

export const userService = {
  async register(registerData) {
    const { name, email, password } = registerData;

    if (password.length < 6) {
      throw new AppError("Password must be at least 6 characters", StatusCodes.BAD_REQUEST);
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new AppError("Email already registered", StatusCodes.CONFLICT);
    }

    // Hash password and create user
    const hashedPassword = hashPassword(password);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // Generate token
    const token = signJWT({
      userId: user._id,
      email: user.email,
      role: user.role,
    });

    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    };
  },

  async login(loginData) {
    const { email, password } = loginData;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      throw new AppError("Invalid email or password", StatusCodes.UNAUTHORIZED);
    }

    // Verify password
    const isPasswordValid = comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new AppError("Invalid email or password", StatusCodes.UNAUTHORIZED);
    }

    // Generate token
    const token = signJWT({
      userId: user._id,
      email: user.email,
      role: user.role,
    });

    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    };
  },

  async getProfile(userId) {
    const user = await User.findById(userId).select("-password");

    if (!user) {
      throw new AppError("User not found", StatusCodes.NOT_FOUND);
    }

    return user;
  },
};
