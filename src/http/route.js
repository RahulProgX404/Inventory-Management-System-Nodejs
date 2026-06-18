import { Router } from "express";

import { healthRouter } from "../modules/health/health.route.js";
import { userRouter } from "../modules/users/user.route.js";
import { categoryRouter } from "../modules/categories/category.route.js";
import { inventoryRouter } from "../modules/inventory/inventory.route.js";

export const router = Router();

router.use("/health", healthRouter);
router.use("/users", userRouter);
router.use("/categories", categoryRouter);
router.use("/inventory", inventoryRouter);
