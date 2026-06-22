// Helper utilities for permission generation and matching
export const CRUD_ACTIONS = ["create", "read", "update", "delete"];

/**
 * Generate namespaced permissions for a resource.
 * Example: makePermissions('categories') => ['categories.create', ...]
 */
export function makePermissions(resource, actions = CRUD_ACTIONS) {
  if (!resource || typeof resource !== "string") return [];
  return actions.map((a) => `${resource}.${a}`);
}

/**
 * Check whether a single role permission (may include wildcards) matches a required permission.
 * Supported patterns:
 *  - '*' matches everything
 *  - 'resource.*' matches any action on resource
 *  - '*.action' matches action on any resource
 */
export function permissionMatches(rolePerm, requiredPerm) {
  if (!rolePerm || !requiredPerm) return false;
  if (rolePerm === "*") return true;
  if (rolePerm === requiredPerm) return true;

  // resource.* pattern
  if (rolePerm.endsWith(".*")) {
    const prefix = rolePerm.slice(0, -2);
    return requiredPerm.startsWith(prefix + ".");
  }

  // *.action pattern
  if (rolePerm.startsWith("*.")) {
    const action = rolePerm.slice(2);
    return requiredPerm.endsWith("." + action);
  }

  return false;
}

/**
 * Check whether any permission in rolePerms satisfies requiredPerm.
 * rolePerms: array of strings assigned to the role
 * requiredPerm: 'resource.action'
 */
export function hasPermission(rolePerms = [], requiredPerm) {
  if (!Array.isArray(rolePerms)) return false;
  return rolePerms.some((rp) => permissionMatches(rp, requiredPerm));
}

/**
 * Compose authorization middleware: authentication, optional role check, optional permission check.
 * Returns an array suitable for spreading into route handlers.
 *
 * Example: enforceAuthorization(['admin'], ['categories.create'])
 */
export function enforceAuthorization(roles = [], perms = []) {
  return [
    async (req, res, next) => {
      const { verifyJWT } = await import("../middlewares/jwt.middleware.js");
      return verifyJWT(req, res, next);
    },
    async (req, res, next) => {
      if (!roles.length) return next();
      const { authorize } = await import("../middlewares/role.middleware.js");
      return authorize(...roles)(req, res, next);
    },
    async (req, res, next) => {
      if (!perms.length) return next();
      const { requirePermission } = await import("../middlewares/role.middleware.js");
      return requirePermission(...perms)(req, res, next);
    },
  ];
}
