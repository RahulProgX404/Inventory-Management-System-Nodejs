export const UserRole = {
  ADMIN: "admin",
  STAFF: "staff",
  USER: "user",
  GUEST: "guest",
};

import { makePermissions } from "./permissions.js";

const categoriesPerms = makePermissions("categories");

export const RolePermissions = {
  // Namespaced permissions are generated programmatically per resource
  [UserRole.ADMIN]: [...categoriesPerms],
  [UserRole.STAFF]: [...categoriesPerms.filter((p) => !p.endsWith(".delete"))],
  [UserRole.USER]: [...categoriesPerms.filter((p) => p.endsWith(".read"))],
  [UserRole.GUEST]: [],
};

export const SalesOrderStatus = {
  PENDING: "PENDING",
  CONFIRMED: "CONFIRMED",
  SHIPPED: "SHIPPED",
  DELIVERED: "DELIVERED",
  CANCELLED: "CANCELLED",
};

export const PurchaseStatus = {
  DRAFT: "DRAFT",
  PENDING: "PENDING",
  RECEIVED: "RECEIVED",
  CANCELLED: "CANCELLED",
};

export const TransactionStatus = {
  IN: "IN",
  OUT: "OUT",
  ADJUSTMENT: "ADJUSTMENT",
  TRANSFER: "TRANSFER",
};
