import { StatusCodes } from "http-status-codes";
import { asyncHandler } from "../../utils/async-handler.js";
import { notificationService } from "./notification.service.js";
import { AppError } from "../../utils/app-error.js";

export const getNotifications = asyncHandler(async (req, res) => {
  const result = await notificationService.findAll(req.query);
  res.success(result, "Notifications retrieved successfully", StatusCodes.OK);
});

export const getUnreadCount = asyncHandler(async (req, res) => {
  const count = await notificationService.getUnreadCount();
  res.success({ count }, "Unread count retrieved successfully", StatusCodes.OK);
});

export const markAsRead = asyncHandler(async (req, res) => {
  const notification = await notificationService.markAsRead(req.params.id);
  if (!notification) throw new AppError("Notification not found", StatusCodes.NOT_FOUND);
  res.success(notification, "Notification marked as read", StatusCodes.OK);
});

export const markAllAsRead = asyncHandler(async (req, res) => {
  const count = await notificationService.markAllAsRead();
  res.success({ updated: count }, "All notifications marked as read", StatusCodes.OK);
});
