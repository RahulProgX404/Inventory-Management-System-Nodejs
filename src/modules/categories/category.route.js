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

export const categoryRouter = Router();

categoryRouter.post("/", validateRequest(createCategorySchema), createCategory);
categoryRouter.get("/", getCategories);

categoryRouter.get("/:id", getCategory);
categoryRouter.patch("/:id", validateRequest(updateCategorySchema), updateCategory);
categoryRouter.delete("/:id", deleteCategory);
