import { Router } from "express";
import { validateRequest } from "../../middlewares/validation.middleware.js";
import { validateObjectId } from "../../utils/validation.js";
import { uploadProductImage } from "../../middlewares/upload.middleware.js";
import { createProductSchema, updateProductSchema } from "./product.schema.js";
import {
  createProduct,
  deleteProduct,
  getProducts,
  getProduct,
  getProductByBarcode,
  updateProduct,
} from "./product.controller.js";
import { enforceAuthorization } from "../../utils/permissions.js";

export const productRouter = Router();

productRouter.post(
  "/",
  ...enforceAuthorization(["admin", "staff"], ["products.create"]),
  uploadProductImage,
  validateRequest(createProductSchema),
  createProduct
);

productRouter.get("/", ...enforceAuthorization([], ["products.read"]), getProducts);

productRouter.get(
  "/barcode/:barcode",
  ...enforceAuthorization([], ["products.read"]),
  getProductByBarcode
);

productRouter.get(
  "/:id",
  ...enforceAuthorization([], ["products.read"]),
  validateObjectId("id"),
  getProduct
);

productRouter.patch(
  "/:id",
  ...enforceAuthorization([], ["products.update"]),
  validateObjectId("id"),
  uploadProductImage,
  validateRequest(updateProductSchema),
  updateProduct
);

productRouter.delete(
  "/:id",
  ...enforceAuthorization([], ["products.delete"]),
  validateObjectId("id"),
  deleteProduct
);
