import { StatusCodes } from "http-status-codes";
import crypto from "node:crypto";

import User from "./user.model.js";
import { AppError } from "../../utils/app-error.js";
import { hashPassword, comparePassword, generateTokenPair } from "../../utils/crypto.js";
import { createAccessToken, createRefreshToken } from "../../utils/jwt.js";
import { paginate, formatPaginatedResponse } from "../../utils/pagination.js";
import { auditLogService } from "../audit-logs/auditLog.service.js";
import { AuditAction } from "../../utils/enum.js";

function buildTokenPayload(user) {
  return { userId: user.id, email: user.email, role: user.role };
}

function hashRawToken(raw) {
  return crypto.createHash("sha256").update(raw).digest("hex");
}

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

    // save the user creation record in audit logs
    await auditLogService.record({
      userId: user._id,
      action: AuditAction.CREATE,
      entityType: "User",
      entityId: user._id,
      newData: { name: user.name, email: user.email, role: user.role },
    });

    // Generate tokens
    const payload = buildTokenPayload(user);
    const accessToken = createAccessToken(payload);
    const { raw: rawRefresh, hashed: refreshHash } = generateTokenPair();

    user.refreshTokenHash = refreshHash;
    user.lastLoginAt = new Date();
    await user.save();

    const refreshToken = createRefreshToken({
      ...payload,
      raw: rawRefresh,
    });

    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      accessToken,
      refreshToken,
    };
  },

  async login(loginData) {
    const { email, password } = loginData;

    // Find user
    const user = await User.findOne({ email }).select("+password +refreshTokenHash");
    if (!user) {
      throw new AppError("Invalid email or password", StatusCodes.UNAUTHORIZED);
    }

    if (!user.isActive) throw new AppError("Account has been deactivated", StatusCodes.FORBIDDEN);

    // Verify password
    const isPasswordValid = comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new AppError("Invalid email or password", StatusCodes.UNAUTHORIZED);
    }

    // Generate tokens
    const payload = buildTokenPayload(user);
    const accessToken = createAccessToken(payload);
    const { raw: rawRefresh, hashed: refreshHash } = generateTokenPair();

    user.refreshTokenHash = refreshHash;
    user.lastLoginAt = new Date();
    await user.save();

    // save login record in audit logs
    await auditLogService.record({
      userid: user._id,
      action: AuditAction.LOGIN,
      entityType: "User",
      entityId: user._id,
      newData: { loginAt: user.lastLoginAt },
    });

    const refreshToken = createRefreshToken({
      ...payload,
      raw: rawRefresh,
    });

    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      accessToken,
      refreshToken,
    };
  },

  async refreshTokens(userId, rawRefreshToken) {
    const user = await User.findById(userId).select("+refreshTokenHash");
    if (!user || !user.refreshTokenHash)
      throw new AppError("Invalid refresh token", StatusCodes.UNAUTHORIZED);

    if (!user.isActive) throw new AppError("Account has been deactivated", StatusCodes.FORBIDDEN);

    const incomingRefreshToken = hashRawToken(rawRefreshToken);
    if (incomingRefreshToken !== user.refreshTokenHash) {
      user.refreshTokenHash = undefined;
      await user.save();
      throw new AppError(
        "Refresh token reuse detected. Please login in again.",
        StatusCodes.UNAUTHORIZED
      );
    }

    const payload = buildTokenPayload(user);
    const accessToken = createAccessToken(payload);
    const { raw: newRaw, hashed: newHash } = generateTokenPair();

    user.refreshTokenHash = newHash;
    await user.save();

    return {
      accessToken,
      refreshToken: createRefreshToken({ ...payload, new: newRaw }),
    };
  },

  async logout(userId) {
    await User.findByIdAndUpdate(userId, { $unset: { refreshTokenHash: 1 } });
  },

  async getProfile(userId) {
    const user = await User.findById(userId).select("-password -refreshTokensHash");

    if (!user) {
      throw new AppError("User not found", StatusCodes.NOT_FOUND);
    }

    return user;
  },

  async updateProfile(userId, updateData) {
    const { name } = updateData;
    const user = await User.findByIdAndUpdate(
      userId,
      { name },
      { new: true, runValidators: true }
    ).select("-password -refreshTokenHash");
    if (!user) throw new AppError("User not found", StatusCodes.NOT_FOUND);
    return user;
  },

  async changePassword(userId, { currentPassword, newPassword }) {
    const user = await User.findById(userId).select("+password");
    if (!user) throw new AppError("User not found", StatusCodes.NOT_FOUND);

    const isValid = await comparePassword(currentPassword, user.pasword);
    if (!isValid) throw new AppError("Current password is incorrect", StatusCodes.BAD_REQUEST);

    user.password = await hashPassword(newPassword);
    user.passwordChangedAt = new Date();

    user.refreshTokenHash = undefined;

    await user.save();
  },

  ///-------------------------- for admins
  async findAll(query) {
    const { page, limit, skip } = paginate(query.page, query.limit);
    const filter = {};
    if (query.role) filter.role = query.role;
    if (query.isActive !== undefined) {
      filter.isActive = query.isActive === "true" || query.isActive === true;
    }

    if (query.search) {
      filter.$or = [
        { name: { $regex: query.search, $options: "i" } },
        { email: { $regex: query.search, $options: "i" } },
      ];
    }

    const [data, total] = await Promise.all([
      (await User.find(filter).select("-password -refreshTokenHash").skip(skip).limit(limit)).sort({
        createdAt: -1,
      }),
      User.countDocuments(filter),
    ]);
    return formatPaginatedResponse(data, total, page, limit);
  },

  async findById(id) {
    const user = await User.findById(id).select("-password -refreshTokenHash");
    if (!user) throw new AppError("User not found", StatusCodes.NOT_FOUND);
    return user;
  },

  async adminUpdateUser(id, updateData, requesterId) {
    if (id === requesterId?.toString()) {
      throw new AppError(
        "Admins cannot modify their own role or status via this endpoint",
        StatusCodes.FORBIDDEN
      );
    }
    const user = await User.findByIdAndUpdate(
      id,
      {
        role: updateData.role,
        isActive: updateData.isActive,
      },
      { new: true, runValidators: true }
    ).select("-password -refreshTokenHash");
    if (!user) throw new AppError("User not found", StatusCodes.NOT_FOUND);

    // Deactivating a user should revoke their tokens
    if (updateData.isActive === false) {
      await User.findByIdAndUpdate(id, { $unset: { refreshTokenHash: 1 } });
    }

    // TODO: save action record to audit logs

    return user;
  },

  async deleteUser(id, requesterId) {
    if (id === requesterId?.toString()) {
      throw new AppError("Cannot delete your own account", StatusCodes.FORBIDDEN);
    }

    const user = await User.findByIdAndDelete(id);
    if (!user) throw new AppError("User not found", StatusCodes.NOT_FOUND);

    // save delete record to the audit log
    await auditLogService.record({
      userId: requesterId,
      action: AuditAction.DELETE,
      entityType: "User",
      entityId: user._id,
    });

    return user;
  },
};
