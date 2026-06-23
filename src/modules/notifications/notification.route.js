import { Router } from "express";
import { enforceAuthorization } from "../../utils/permissions.js";
import { getNotifications, getUnreadCount, markAsRead } from "./notification.controller.js";
import { validateObjectId } from "../../utils/validation.js";

export const notificationRouter = Router();

notificationRouter.get(
  "/",
  ...enforceAuthorization(["admin", "staff"], ["notifications.read"]),
  getNotifications
);

notificationRouter.get(
  "/unread-count",
  ...enforceAuthorization(["admin", "staff"], ["notifications.read"]),
  getUnreadCount
);

notificationRouter.patch(
  "/:id/read",
  ...enforceAuthorization(["admin", "staff"], ["notifications.update"]),
  validateObjectId("id"),
  markAsRead
);
notificationRouter.patch(
  "/read-all",
  ...enforceAuthorization(["admin", "staff"], ["notifications.update"]),
  markAsRead
);
