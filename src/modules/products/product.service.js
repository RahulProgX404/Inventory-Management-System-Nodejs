import { StatusCodes } from "http-status-codes";
import fs from "node:fs/promises";
import path from "node:path";

import Product from "./product.models.js";
import Category from "../categories/category.model.js";

import { AppError } from "../../utils/app-error.js";
import { paginate, formatPaginatedResponse } from "../../utils/pagination.js";
import { generateSku } from "../../utils/helper.js";
import { auditLogService } from "../audit-logs/auditLog.service.js";
import { AuditAction } from "../../utils/enum.js";

async function assertCategoryExists(categoryId) {
  const category = await Category.findById(categoryId);
  if (!category) throw new AppError("Category not found", StatusCodes.BAD_REQUEST);
}

async function assertSupplierExists(supplierId) {
  if (!supplierId) return;
  const supplier = null; // TODO: await Supplier.findById(supplierId)
  if (!supplier) throw new AppError("Supplier not found", StatusCodes.BAD_REQUEST);
}

async function generateUniqueSku() {
  const count = await Product.countDocuments();
  let sku = generateSku("PRD", count);

  let attempt = count;
  while (await Product.findOne({ sku })) {
    attempt += 1;
    sku = generateSku("PRD", attempt);
  }
  return sku;
}

async function deleteImageFile(imagePath) {
  if (!imagePath) return;
  try {
    await fs.unlink(path.resolve(process.cwd(), imagePath.replace(/^\//, "")));
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
}

export const productService = {
  async create(createData, file, userId) {
    await assertCategoryExists(createData.category);
    await assertSupplierExists(createData.supplier);

    const sku = createData.sku || (await generateUniqueSku());

    const existingSku = await Product.findOne({ sku });
    if (existingSku) throw new AppError("SKU already in use", StatusCodes.CONFLICT);

    if (createData.barcode) {
      const existingBarcode = await Product.findOne({ barcode: createData.barcode });
      if (existingBarcode) throw new AppError("Barcode already in use", StatusCodes.CONFLICT);
    }

    const product = await Product.create({
      ...createData,
      sku,
      image: file ? `/uploads/products/${file.filename}` : undefined,
    });

    await auditLogService.record({
      userId,
      action: AuditAction.CREATE,
      entityType: "Product",
      entityId: product._id,
      newData: product.toObject(),
    });

    return product;
  },

  async findById(id) {
    const product = await Product.findById(id)
      .populate("category", "name")
      .populate("supplier", "name");

    if (!product) throw new AppError("Product not found", StatusCodes.NOT_FOUND);

    return product;
  },

  async update(id, updateData, file, userId) {
    const product = await Product.findById(id);
    if (!product) throw new AppError("Product not found", StatusCodes.NOT_FOUND);

    if (updateData.category) {
      await assertCategoryExists(updateData.category);
    }
    if (updateData.supplier) {
      await assertSupplierExists(updateData.supplier);
    }

    if (updateData.sku && updateData.sku !== product.sku) {
      const existingSku = await Product.findOne({ sku: updateData.sku, _id: { $ne: id } });
      if (existingSku) {
        throw new AppError("SKU already in use", StatusCodes.CONFLICT);
      }
    }

    if (updateData.barcode && updateData.barcode !== product.barcode) {
      const existingBarcode = await Product.findOne({
        barcode: updateData.barcode,
        _id: { $ne: id },
      });
      if (existingBarcode) throw new AppError("Barcode already in use", StatusCodes.CONFLICT);
    }

    const oldData = product.toObject();
    const previousImage = product.image;
    Object.assign(product, updateData);

    if (file) {
      product.image = `/uploads/products/${file.filename}`;
    }

    await product.save();

    if (file && previousImage) await deleteImageFile(previousImage);

    await auditLogService.record({
      userId,
      action: AuditAction.UPDATE,
      entityType: "Product",
      entityId: product._id,
      oldData,
      newData: product.toObject(),
    });

    return product;
  },

  async deleteById(id, userId) {
    const product = await Product.findByIdAndDelete(id);
    if (!product) throw new AppError("Product not found", StatusCodes.NOT_FOUND);

    await deleteImageFile(product.image);

    await auditLogService.record({
      userId,
      action: AuditAction.DELETE,
      entityType: "Product",
      entityId: product._id,
      oldData: product.toObject(),
    });

    return product;
  },

  async findAll(query) {
    const { page, limit, skip } = paginate(query.page, query.limit);
    const search = String(query.search || "").trim();

    const filter = {};
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { sku: { $regex: search, $options: "i" } },
        { barcode: { $regex: search, $options: "i" } },
      ];
    }
    if (query.category) filter.category = query.category;
    if (query.supplier) filter.supplier = query.supplier;
    if (query.isActive !== undefined) {
      filter.isActive = query.isActive === "true" || query.isActive === true;
    }
    if (query.lowStock === "true" || query.lowStock === true) {
      filter.$expr = { $lte: ["$currentStock", "$recorderLevel"] };
    }

    const [data, total] = await Promise.all([
      (
        await Product.find(filter)
          .populate("category", "name")
          .populate("supplier", "name")
          .skip(skip)
          .limit(limit)
      ).toSorted({ createdAt: -1 }),
      Product.countDocuments(filter),
    ]);
    return formatPaginatedResponse(data, total, page, limit);
  },

  async findByBarcode(barcode) {
    const product = await Product.findOne({ barcode }).populate("category", "name");
    if (!product) throw new AppError("Product not found", StatusCodes.NOT_FOUND);
    return product;
  },
};
