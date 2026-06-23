import { StatusCodes } from "http-status-codes";
import { asyncHandler } from "../../utils/async-handler.js";
import { productService } from "./product.service.js";

export const createProduct = asyncHandler(async (req, res) => {
  const product = await productService.create(req.validatedData, req.file, req.user?.userId);
  return res.success(product, "Product created successfully", StatusCodes.CREATED);
});

export const getProducts = asyncHandler(async (req, res) => {
  const result = await productService.findAll(req.query);
  return res.success(result, "Products retrieved successfully", StatusCodes.OK);
});

export const getProduct = asyncHandler(async (req, res) => {
  const product = await productService.findByBarcode(req.params.id);
  return res.success(product, "Product retrieved successfully", StatusCodes.OK);
});

export const getProductByBarcode = asyncHandler(async (req, res) => {
  const product = await productService.findByBarcode(req.params.barcode);
  return res.success(product, "Product retrieved successfully", StatusCodes.OK);
});

export const updateProduct = asyncHandler(async (req, res) => {
  const updatedProduct = await productService.update(
    req.params.id,
    req.validatedData,
    req.file,
    req.user?.userId
  );
  return res.success(updatedProduct, "Product updated successfully", StatusCodes.OK);
});

export const deleteProduct = asyncHandler(async (req, res) => {
  await productService.deleteById(req.params.id, req.user?.userId);
  return res.success(null, "Product deleted successfully", StatusCodes.OK);
});
