import { Router } from "express";

import { healthRouter } from "../modules/health/health.route.js";
import { userRouter } from "../modules/users/user.route.js";
import { categoryRouter } from "../modules/categories/category.route.js";
import { inventoryRouter } from "../modules/inventory/inventory.route.js";
import { auditLogRouter } from "../modules/audit-logs/auditLog.route.js";
import { productRouter } from "../modules/products/product.route.js";

export const router = Router();

router.use("/health", healthRouter);
router.use("/users", userRouter);
router.use("/audit-logs", auditLogRouter);
router.use("/categories", categoryRouter);
router.use("/inventories", inventoryRouter);
router.use("/products", productRouter);
