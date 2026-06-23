import logger from "../../config/logger.js";
import { formatPaginatedResponse, paginate } from "../../utils/pagination.js";
import Notification, { NotificationType } from "./notification.model.js";

export const notificationService = {
  async notify({ type, title, message, relatedEntityType, relatedEntityId }) {
    try {
      return await Notification.create({
        type,
        title,
        message,
        relatedEntityType,
        relatedEntityId,
      });
    } catch (error) {
      logger.error({ err: error, message: "Failed to create notification" });
      return null;
    }
  },

  async checkAndNotifyLowStock(product) {
    if (product.currentStock > product.reorderLevel) return null;
    const isOutOfStock = product.currentStock === 0;

    const existing = await Notification.findOne({
      relatedEntityType: "Product",
      relatedEntityId: product._id,
      type: isOutOfStock ? NotificationType.OUT_OF_STOCK : NotificationType.LOW_STOCK,
      isRead: false,
    });
    if (existing) return existing;

    return this.notify({
      type: isOutOfStock ? NotificationType.OUT_OF_STOCK : NotificationType.LOW_STOCK,
      title: isOutOfStock ? "Product out of stock" : "Low stock alert",
      message: isOutOfStock
        ? `"${product.name}" (SKU: ${product.sku}) is out of stock.`
        : `"${product.name}" (SKU: ${product.sku}) has ${product.currentStock} units left, at or below its reorder level of ${product.reorderLevel}.`,
      relatedEntityType: "Product",
      relatedEntityId: product._id,
    });
  },

  async findAll(query) {
    const { page, limit, skip } = paginate(query.page, query.limit);
    const filter = {};
    if (query.type) filter.type = query.type;
    if (query.isRead !== undefined) {
      filter.isRead = query.isRead === "true" || query.isRead === true;
    }

    const [data, total] = await Promise.all([
      Notification.find(filter).skip(skip).limit(limit).toSorted({ createdAt: -1 }),
      Notification.countDocuments(filter),
    ]);

    return formatPaginatedResponse(data, total, page, limit);
  },

  async markAsRead(id) {
    const notification = await Notification.findByIdAndUpdate(id, { isRead: true }, { new: true });
    return notification;
  },

  async markAllAsRead() {
    const result = await Notification.updateMany({ isRead: false }, { isRead: true });
    return result.modifiedCount;
  },

  async getUnreadCount() {
    return Notification.countDocuments({ isRead: false });
  },
};
