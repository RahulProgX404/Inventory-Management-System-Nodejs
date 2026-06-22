import { makePermissions } from "./permissions.js";

export const UserRole = {
  ADMIN: "admin",
  STAFF: "staff",
  USER: "user",
  GUEST: "guest",
};

const categoriesPerms = makePermissions("categories");
const inventoryPerms = makePermissions("inventory");
const productsPerms = makePermissions("products");
const supplierPerms = makePermissions("supplier");
const warehousePerms = makePermissions("warehouse");
const purchaseOrdersPerms = makePermissions("purchase-orders");
const salesOrdersPerms = makePermissions("sales-orders");
const auditLogsPerms = makePermissions("audit-logs", ["read"]);
const reportsPerms = makePermissions("reports", ["read"]);
const usersPerms = makePermissions("users", ["read"]);

const allPerms = [
  ...categoriesPerms,
  ...inventoryPerms,
  ...productsPerms,
  ...supplierPerms,
  ...warehousePerms,
  ...purchaseOrdersPerms,
  ...salesOrdersPerms,
  ...auditLogsPerms,
  ...reportsPerms,
  ...usersPerms,
];

const staffPerms = allPerms.filter(
  (perms) =>
    !perms.endsWith(".delete") && !perms.startsWith("users.") && !perms.startsWith("audit-logs.")
);

const userPerms = [
  ...categoriesPerms.filter((perms) => perms.endsWith(".read")),
  ...productsPerms.filter((perms) => perms.endsWith(".read")),
  ...inventoryPerms.filter((perms) => perms.endsWith(".read")),
];

export const RolePermissions = {
  // Namespaced permissions are generated programmatically per resource
  [UserRole.ADMIN]: allPerms,
  [UserRole.STAFF]: staffPerms,
  [UserRole.USER]: userPerms,
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

export const AuditAction = {
  CREATE: "CREATE",
  UPDATE: "UPDATE",
  DELETE: "DELETE",
  LOGIN: "LOGIN",
  STOCK_IN: "STOCK_IN",
  STOCK_OUT: "STOCK_OUT",
  STOCK_ADJUST: "STOCK_ADJUST",
};
