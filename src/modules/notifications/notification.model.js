import mongoose from "mongoose";

export const NotificationType = {
  LOW_STOCK: "LOW_STOCK",
  OUT_OF_STOCK: "OUT_OF_STOCK",
  ORDER_STATUS: "ORDER_STATUS",
  SYSTEM: "SYSTEM",
};

const notificationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: Object.values(NotificationType),
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    relatedEntityType: String,
    relatedEntityId: mongoose.Schema.Types.ObjectId,
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  { timestamps: true }
);

notificationSchema.index({ recipient: 1, isRead: 1, createdAt: -1 });
notificationSchema.index({ type: 1 });

const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;
