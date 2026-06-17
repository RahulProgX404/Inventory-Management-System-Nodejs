import { Router } from "express";

import { healthRouter } from "../modules/health/health.route.js";
import { userRouter } from "../modules/users/user.route.js";

export const router = Router();

router.use("/health", healthRouter);
router.use("/users", userRouter);
