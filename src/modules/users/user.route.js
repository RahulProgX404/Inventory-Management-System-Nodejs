import { Router } from "express";

import { register, login, getProfile } from "./user.controller.js";
import { validateRequest } from "../../middlewares/validation.middleware.js";
import { registerSchema, loginSchema } from "./user.schema.js";
import { verifyJWT } from "../../middlewares/jwt.middleware.js";

export const userRouter = Router();

// Public routes
userRouter.post("/register", validateRequest(registerSchema), register);
userRouter.post("/login", validateRequest(loginSchema), login);

// Protected routes
userRouter.get("/profile", verifyJWT, getProfile);
