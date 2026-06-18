import { StatusCodes } from "http-status-codes";
import { AppError } from "../utils/app-error.js";
import { RolePermissions } from "../utils/enum.js";
import { hasPermission } from "../utils/permissions.js";

/**
 * Middleware to authorize based on user roles.
 * Usage: authorize('admin', 'manager')
 */
export function authorize(...roles) {
  return (req, _res, next) => {
    if (!req.user) {
      throw new AppError("Unauthorized: No user context", StatusCodes.UNAUTHORIZED);
    }

    if (roles.length > 0 && !roles.includes(req.user.role)) {
      throw new AppError("Forbidden: Permission denied", StatusCodes.FORBIDDEN);
    }

    return next();
  };
}

/**
 * Middleware to require specific permissions (e.g. 'create', 'read').
 * It looks up permissions for the current user's role in `RolePermissions`.
 * Usage: requirePermission('create')
 */
export function requirePermission(...permissions) {
  return (req, _res, next) => {
    if (!req.user) {
      throw new AppError("Unauthorized: No user context", StatusCodes.UNAUTHORIZED);
    }

    const role = req.user.role;
    const rolePerms = Array.isArray(RolePermissions?.[role]) ? RolePermissions[role] : [];

    // Support two-arg form: requirePermission('resource', 'action')
    let required = permissions;
    if (
      permissions.length === 2 &&
      typeof permissions[0] === "string" &&
      typeof permissions[1] === "string" &&
      !permissions[0].includes(".") &&
      !permissions[1].includes(".")
    ) {
      required = [`${permissions[0]}.${permissions[1]}`];
    }

    const hasAll = required.every((p) => hasPermission(rolePerms, p));
    if (!hasAll) {
      throw new AppError("Forbidden: Insufficient permissions", StatusCodes.FORBIDDEN);
    }

    return next();
  };
}
