import { Router } from "express";

import {
  register,
  login,
  getProfile,
  refreshTokens,
  updateProfile,
  changePassword,
  getUsers,
  adminUpdateUser,
  deleteUser,
} from "./user.controller.js";
import { validateRequest } from "../../middlewares/validation.middleware.js";
import {
  registerSchema,
  loginSchema,
  refreshSchema,
  updateProfileSchema,
  changePasswordSchema,
  adminUpdateUserSchema,
} from "./user.schema.js";
import { verifyJWT } from "../../middlewares/jwt.middleware.js";
import { enforceAuthorization } from "../../utils/permissions.js";
import { validateObjectId } from "../../utils/validation.js";

export const userRouter = Router();

// Public routes
userRouter.post("/register", validateRequest(registerSchema), register);
userRouter.post("/login", validateRequest(loginSchema), login);
userRouter.post("/refresh", validateRequest(refreshSchema), refreshTokens);

// Authenticated user
userRouter.get("/profile", verifyJWT, getProfile);
userRouter.post("/logout", verifyJWT, getProfile);
userRouter.patch("/profile", verifyJWT, validateRequest(updateProfileSchema), updateProfile);
userRouter.post(
  "/change-password",
  verifyJWT,
  validateRequest(changePasswordSchema),
  changePassword
);

// Admin only
userRouter.get("/", ...enforceAuthorization(["admin"], ["users.read"]), getUsers);
userRouter.get("/:id", ...enforceAuthorization(["admin"], ["users.read"]), validateObjectId("id"));
userRouter.patch(
  "/:id",
  ...enforceAuthorization(["admin"], ["users.update"]),
  validateObjectId("id"),
  validateRequest(adminUpdateUserSchema),
  adminUpdateUser
);
userRouter.delete(
  "/:id",
  ...enforceAuthorization(["admin"], ["users.delete"]),
  validateObjectId("id"),
  deleteUser
);
