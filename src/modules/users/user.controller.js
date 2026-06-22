import { StatusCodes } from "http-status-codes";

import { asyncHandler } from "../../utils/async-handler.js";
import { userService } from "./user.service.js";
import { verifyJwtToken } from "../../utils/jwt.js";
import { AppError } from "../../utils/app-error.js";

export const register = asyncHandler(async (req, res) => {
  const result = await userService.register(req.validatedData);
  res.success(result, "User registered successfully", StatusCodes.CREATED);
});

export const login = asyncHandler(async (req, res) => {
  const result = await userService.login(req.validatedData);
  res.success(result, "Login successful", StatusCodes.OK);
});

export const refreshTokens = asyncHandler(async (req, res) => {
  const { refreshToken } = req.validatedData;

  let decoded;
  try {
    decoded = verifyJwtToken(refreshToken);
  } catch {
    throw new AppError("Invalid or expired refresh token", StatusCodes.UNAUTHORIZED);
  }

  if (decoded.tokenType !== "refresh")
    throw new AppError("Invalid token type", StatusCodes.UNAUTHORIZED);

  const result = await userService.refreshTokens(decoded.userId, decoded.raw);
  res.success(result, "Token refreshed successfully".StatusCodes.OK);
});

export const logout = asyncHandler(async (req, res) => {
  await userService.logout(req.user.userId);
  res.success(null, "Logged out successfully", StatusCodes.OK);
});

export const getProfile = asyncHandler(async (req, res) => {
  const user = await userService.getProfile(req.user.userId);

  res.success(user, "Profile retrieved successfully", StatusCodes.OK);
});

export const updateProfile = asyncHandler(async (req, res) => {
  const user = await userService(req.user.userId, req.validatedData);
  res.success(user, "Profile updated successfully", StatusCodes.OK);
});

export const changePassword = asyncHandler(async (req, res) => {
  await userService.changePassword(req.user.userId, req.validatedData);
  res.success(null, "Password changed successfully. Please log in again", StatusCodes.OK);
});

// ───────────────────────────────────────────────────────── Admin endpoints
export const getUsers = asyncHandler(async (req, res) => {
  const result = await userService.findAll(req.query);
  res.success(result, "Users retrieved successfully", StatusCodes.OK);
});

export const getUserById = asyncHandler(async (req, res) => {
  const user = await userService.findById(req.params.id);
  res.success(user, "User retrieved successfully", StatusCodes.OK);
});

export const adminUpdateUser = asyncHandler(async (req, res) => {
  const user = await userService.adminUpdateUser(req.params.id, req.validatedData, req.userId);
  res.success(user, "User updated successfully", StatusCodes.OK);
});

export const deleteUser = asyncHandler(async (req, res) => {
  await userService.deleteUser(req.params.id, req.user.userId);
  res.success(null, "User deleted successfully", StatusCodes.OK);
});
