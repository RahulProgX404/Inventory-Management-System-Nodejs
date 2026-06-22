import { z } from "zod";
import { UserRole } from "../../utils/enum.js";

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/\d/, "Password must contain at least one number");

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at lease 2 characters").max(100),
  email: z.string().email("Invalid email address"),
  password: passwordSchema,
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const refreshSchema = z.object({
  refreshToken: z.string().min(1, "Refresh token is required"),
});

export const updateProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password id required"),
    newPassword: passwordSchema,
  })
  .refine((d) => d.currentPassword !== d.newPassword, {
    message: "New password must be different from current password",
    path: ["newPassword"],
  });

export const adminUpdateUserSchema = z
  .object({
    role: z.enum(Object.values(UserRole)).optional(),
    isActive: z.boolean().optional(),
  })
  .refine((d) => d.role !== undefined || d.isActive !== undefined, {
    message: "At least one of role or isActive must be provided",
  });
