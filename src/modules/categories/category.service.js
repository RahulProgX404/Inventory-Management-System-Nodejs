import { StatusCodes } from "http-status-codes";

import Category from "./category.model.js";
import { AppError } from "../../utils/app-error.js";
import { paginate, formatPaginatedResponse } from "../../utils/pagination.js";
import { AuditAction } from "../../utils/enum.js";
import { auditLogService } from "../audit-logs/auditLog.service.js";
import Product from "../products/product.models.js";

export const categoryService = {
  async create(createData, userId) {
    const existingCategory = await Category.findOne({ name: createData.name });
    if (existingCategory) {
      throw new AppError("Category already exists", StatusCodes.CONFLICT);
    }

    const category = await Category.create(createData);

    await auditLogService.record({
      userId,
      action: AuditAction.CREATE,
      entityType: "Category",
      entityId: category._id,
      newData: category.toObject(),
    });

    return category;
  },

  async findById(id) {
    const category = await Category.findById(id);
    if (!category) {
      throw new AppError("Category not found", StatusCodes.NOT_FOUND);
    }

    return category;
  },

  async update(id, updateData, userId) {
    const previousCategory = await Category.findById(id);

    if (!previousCategory) {
      throw new AppError("Category not found", StatusCodes.NOT_FOUND);
    }

    const oldData = previousCategory.toObject();

    const category = await Category.findByIdAndUpdate(id, updateData, {
      new: true,
      newValidators: true,
    });

    await auditLogService.record({
      userId,
      action: AuditAction.UPDATE,
      entityType: "Category",
      entityId: category._id,
      oldData,
      newData: category.toObject(),
    });

    return category;
  },

  async deleteById(id, userId) {
    const category = await Category.findById(id);
    if (!category) {
      throw new AppError("Category not found", StatusCodes.NOT_FOUND);
    }

    const productCount = await Product.countDocuments({ category: id });
    if (productCount > 0) {
      throw new AppError(
        `Cannot delete category: ${productCount} product(s) still reference it`,
        StatusCodes.CONFLICT
      );
    }

    await Category.findByIdAndDelete(id);

    await auditLogService.record({
      userId,
      action: AuditAction.DELETE,
      entityType: "Category",
      entityId: category._id,
      oldData: category.toObject(),
    });

    return category;
  },

  async findAll(query) {
    const { page, limit, skip } = paginate(query.page, query.limit);
    const search = String(query.search || "").trim();

    const filter = {};
    if (search) {
      filter.name = {
        $regex: search,
        $options: "i",
      };
    }

    const [data, total] = await Promise.all([
      Category.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }),
      Category.countDocuments(filter),
    ]);

    return formatPaginatedResponse(data, total, page, limit);
  },
};
