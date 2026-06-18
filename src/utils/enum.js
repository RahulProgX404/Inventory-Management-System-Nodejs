export const UserRole = {
  ADMIN: "admin",
  MANAGER: "manager",
  USER: "user",
  GUEST: "guest",
};

export const RolePermissions = {
  [UserRole.ADMIN]: ["create", "read", "update", "delete"],
  [UserRole.MANAGER]: ["create", "read", "update"],
  [UserRole.USER]: ["read"],
  [UserRole.GUEST]: [],
};

export const SalesStatus = {
  PENDING: "PENDING",
  CONFIRMED: "CONFIRMED",
  SHIPPED: "SHIPPED",
  DELIVERED: "DELIVERED",
  CANCELLED: "CANCELLED",
};
