import { StatusCodes } from "http-status-codes";

import { asyncHandler } from "../../utils/async-handler.js";
import { userService } from "./user.service.js";

export const register = asyncHandler(async (req, res) => {
  const result = await userService.register(req.validatedData);

  res.success(result, "User registered successfully", StatusCodes.CREATED);
});

export const login = asyncHandler(async (req, res) => {
  const result = await userService.login(req.validatedData);

  res.success(result, "Login successful", StatusCodes.OK);
});

export const getProfile = asyncHandler(async (req, res) => {
  const user = await userService.getProfile(req.user.userId);

  res.success(user, "Profile retrieved successfully", StatusCodes.OK);
});
