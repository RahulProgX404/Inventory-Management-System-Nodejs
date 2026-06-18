import { StatusCodes } from "http-status-codes";
import { asyncHandler } from "../../utils/async-handler.js";
import { inventoryService } from "./inventory.service.js";

export const stockIn = asyncHandler(async (req, res) => {
  const requestData = {
    ...req.validatedData,
    userId: req.user.userId,
  };

  const result = await inventoryService.stockIn(requestData);
  res.success(result, "Stock added successfully", StatusCodes.CREATED);
});

export const stockOut = asyncHandler(async (req, res) => {
  const requestData = {
    ...req.validatedData,
    userId: req.user.userId,
  };

  const result = await inventoryService.stockOut(requestData);
  res.success(result, "Stock removed successfully", StatusCodes.CREATED);
});

export const adjustStock = asyncHandler(async (req, res) => {
  const requestData = {
    ...req.validatedData,
    userId: req.user.userId,
  };

  const result = await inventoryService.adjustStock(requestData);
  res.success(result, "Stock adjusted successfully", StatusCodes.OK);
});

export const getLowStockProducts = asyncHandler(async (req, res) => {
  const result = await inventoryService.getLowStockProducts();
  res.success(result, "Low stock products retrieved successfully", StatusCodes.OK);
});

export const getHistory = asyncHandler(async (req, res) => {
  const result = await inventoryService.getHistory(req.params.productId);
  res.success(result, "Inventory history retrieved successfully", StatusCodes.OK);
});
