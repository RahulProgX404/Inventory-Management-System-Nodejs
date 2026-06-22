import { Router } from "express";
import { validateRequest } from "../../middlewares/validation.middleware.js";
import { createCategorySchema, updateCategorySchema } from "./category.schema.js";
import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategory,
  updateCategory,
} from "./category.controller.js";
import { enforceAuthorization } from "../../utils/permissions.js";
import { validateObjectId } from "../../utils/validation.js";

export const categoryRouter = Router();

categoryRouter.post(
  "/",
  enforceAuthorization(["admin", "staff"], ["categories.create"]),
  validateRequest(createCategorySchema),
  createCategory
);

categoryRouter.get("/", ...enforceAuthorization([], ["categories.read"]), getCategories);

categoryRouter.get("/:id", ...enforceAuthorization([], ["categories.read"]), getCategory);

categoryRouter.patch(
  "/:id",
  ...enforceAuthorization([], ["categories.update"]),
  validateObjectId("id"),
  validateRequest(updateCategorySchema),
  updateCategory
);

categoryRouter.delete(
  "/:id",
  ...enforceAuthorization([], ["categories.delete"]),
  validateObjectId("id"),
  deleteCategory
);
