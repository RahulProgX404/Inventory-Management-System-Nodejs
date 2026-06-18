import { verifyJWT } from "../middlewares/jwt.middleware.js";
import { authorize, requirePermission } from "../middlewares/role.middleware.js";

/**
 * Compose authorization middleware: authentication, optional role check, optional permission check.
 * Returns an array suitable for spreading into route handlers.
 *
 * Example: enforceAuthorization(['admin'], ['categories.create'])
 */
export function enforceAuthorization(roles = [], perms = []) {
  return [
    verifyJWT,
    roles.length ? authorize(...roles) : (req, _, n) => n(),
    perms.length ? requirePermission(...perms) : (req, _, n) => n(),
  ];
}

// Backwards-compatible alias
export const ensure = enforceAuthorization;
