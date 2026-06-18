import { StatusCodes } from "http-status-codes";
import { asyncHandler } from "../../utils/async-handler.js";
import { categoryService } from "./category.service.js";

export const createCategory = asyncHandler(async (req, res) => {
  const category = await categoryService.create(req.validatedData);
  return res.success(category, "Category created successfully", StatusCodes.CREATED);
});

export const getCategories = asyncHandler(async (req, res) => {
  const result = await categoryService.findAll(req.query);
  return res.success(result, "Categories retrieved successfully", StatusCodes.OK);
});

export const getCategory = asyncHandler(async (req, res) => {
  const category = await categoryService.findById(req.params.id);
  return res.success(category, "Category retrieved successfully", StatusCodes.OK);
});

export const updateCategory = asyncHandler(async (req, res) => {
  const updatedCategory = await categoryService.update(req.params.id, req.validatedData);
  return res.success(updatedCategory, "Category updated successfully", StatusCodes.OK);
});

export const deleteCategory = asyncHandler(async (req, res) => {
  await categoryService.deleteById(req.params.id);
  return res.success(null, "Category deleted successfully", StatusCodes.OK);
});
