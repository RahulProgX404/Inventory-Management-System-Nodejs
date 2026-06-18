import { StatusCodes } from "http-status-codes";
import { AppError } from "../../utils/app-error.js";
import Product from "../products/product.models.js";
import InventoryTransaction from "./inventoryTransaction.model.js";
import { TransactionStatus } from "../../utils/enum.js";

async function getProduct(productId) {
  const product = await Product.findById(productId);
  if (!product) {
    throw new AppError("Product not found", StatusCodes.NOT_FOUND);
  }
  return product;
}

function validateQuantity(quantity) {
  if (typeof quantity !== "number" || Number.isNaN(quantity) || quantity <= 0) {
    throw new AppError("Quantity must be a positive number", StatusCodes.BAD_REQUEST);
  }
}

export const inventoryService = {
  async stockIn(validatedData) {
    const { productId, warehouseId, quantity, userId, notes } = validatedData;
    validateQuantity(quantity);

    const product = await getProduct(productId);
    product.currentStock += quantity;
    await product.save();

    const transaction = await InventoryTransaction.create({
      product: productId,
      warehouse: warehouseId,
      quantity,
      type: TransactionStatus.IN,
      notes,
      createdBy: userId,
    });

    return { product, transaction };
  },

  async stockOut(validatedData) {
    const { productId, warehouseId, quantity, userId, notes } = validatedData;
    validateQuantity(quantity);

    const product = await getProduct(productId);
    if (product.currentStock < quantity) {
      throw new AppError("Insufficient stock", StatusCodes.BAD_REQUEST);
    }

    product.currentStock -= quantity;
    await product.save();

    const transaction = await InventoryTransaction.create({
      product: productId,
      warehouse: warehouseId,
      createdBy: userId,
      type: TransactionStatus.OUT,
      quantity,
      notes,
    });

    return { product, transaction };
  },

  async adjustStock(validatedData) {
    const { productId, warehouseId, quantity, userId, notes } = validatedData;
    if (typeof quantity !== "number" || Number.isNaN(quantity) || quantity < 0) {
      throw new AppError("Quantity must be zero or a positive number", StatusCodes.BAD_REQUEST);
    }

    const product = await getProduct(productId);
    product.currentStock = quantity;
    await product.save();

    const transaction = await InventoryTransaction.create({
      product: productId,
      warehouse: warehouseId,
      quantity,
      type: TransactionStatus.ADJUSTMENT,
      notes,
      createdBy: userId,
    });

    return { product, transaction };
  },

  async getLowStockProducts() {
    return Product.find({
      $expr: {
        $lte: ["$currentStock", "$reorderLevel"],
      },
    });
  },

  async getHistory(productId) {
    return InventoryTransaction.find({ product: productId })
      .populate("createdBy")
      .sort({ createdAt: -1 });
  },
};
