import Category from "./category.model.js";
import { AppError } from "../../utils/app-error.js";
import { StatusCodes } from "http-status-codes";
import { paginate, formatPaginatedResponse } from "../../utils/pagination.js";

export const categoryService = {
  async create(createData) {
    const existingCategory = await Category.findOne({ name: createData.name });
    if (existingCategory) {
      throw new AppError("Category already exists", StatusCodes.CONFLICT);
    }

    return Category.create(createData);
  },

  async findById(id) {
    const category = await Category.findById(id);
    if (!category) {
      throw new AppError("Category not found", StatusCodes.NOT_FOUND);
    }

    return category;
  },

  async update(id, updateData) {
    const category = await Category.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
    if (!category) {
      throw new AppError("Category not found", StatusCodes.NOT_FOUND);
    }

    return category;
  },

  async deleteById(id) {
    const category = await Category.findByIdAndDelete(id);
    if (!category) {
      throw new AppError("Category not found", StatusCodes.NOT_FOUND);
    }

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
