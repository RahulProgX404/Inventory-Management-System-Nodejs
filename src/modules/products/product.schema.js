import z from "zod";

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export const createProductSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  sku: z.string().min(1, "SKU is required").optional(),
  barcode: z.string().optional(),
  description: z.string().optional(),
  category: z.string().regex(objectIdRegex, "Invalid category id"),
  supplier: z.string().regex(objectIdRegex, "Invalid supplier id").optional(),
  unitPrice: z.coerce.number().min(0, "Unit price must be 0 or greater"),
  reorderLevel: z.coerce.number().int().min(0).optional(),
});

export const updateProductSchema = z.object({
  name: z.string().min(2).optional(),
  sku: z.string().min(1).optional(),
  barcode: z.string().optional(),
  description: z.string().optional(),
  category: z.string().regex(objectIdRegex, "Invalid category id").optional(),
  supplier: z.string().regex(objectIdRegex, "Invalid supplier id").optional(),
  unitPrice: z.coerce.number().min(0).optional(),
  reorderLevel: z.coerce.number().int().min(0).optional(),
  isActive: z.coerce.boolean().optional(),
});
