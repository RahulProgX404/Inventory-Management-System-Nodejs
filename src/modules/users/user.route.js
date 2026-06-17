import { Router } from "express";

import { register, login, getProfile } from "./user.controller.js";
import { verifyJWT } from "../../middlewares/jwt.middleware.js";

export const userRouter = Router();

// Public routes
userRouter.post("/register", register);
userRouter.post("/login", login);

// Protected routes
userRouter.get("/profile", verifyJWT, getProfile);
