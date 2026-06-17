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
