import { Router } from "express";
import { validateRequest } from "../../middlewares/validation.middleware.js";
import { validateObjectId } from "../../utils/validation.js";
import { stockSchema } from "./inventory.schema.js";
import {
  stockIn,
  stockOut,
  adjustStock,
  getLowStockProducts,
  getHistory,
} from "./inventory.controller.js";
import { enforceAuthorization } from "../../utils/helper.js";

export const inventoryRouter = Router();

inventoryRouter.post(
  "/stock-in",
  ...enforceAuthorization(["admin", "staff"], ["inventory.create"]),
  validateRequest(stockSchema),
  stockIn
);

inventoryRouter.post(
  "/stock-out",
  ...enforceAuthorization(["admin", "staff"], ["inventory.update"]),
  validateRequest(stockSchema),
  stockOut
);

inventoryRouter.patch(
  "/adjust",
  ...enforceAuthorization(["admin", "staff"], ["inventory.update"]),
  validateRequest(stockSchema),
  adjustStock
);

inventoryRouter.get(
  "/low-stock",
  ...enforceAuthorization([], ["inventory.read"]),
  getLowStockProducts
);

inventoryRouter.get(
  "/history/:productId",
  ...enforceAuthorization([], ["inventory.read"]),
  validateObjectId("productId"),
  getHistory
);
