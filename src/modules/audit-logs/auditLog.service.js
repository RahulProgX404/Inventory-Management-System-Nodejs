import AuditLog from "./auditLog.model";
import logger from "../../config/logger.js";
import { paginate, formatPaginateResponse } from "../../utils/pagination.js";

export const auditLogService = {
  async record({ userId, action, entityType, entityId, oldData, newData }) {
    try {
      await AuditLog.create({
        user: userId,
        action,
        entityType,
        entityId,
        oldData,
        newData,
      });
    } catch (error) {
      logger.error({ err: error, message: "Failed to write audit log" });
    }
  },

  async findAll(query) {
    const { page, limit, skip } = paginate(query.page, query.limit);

    const filter = {};
    if (query.entityType) filter.entityType = query.entityType;
    if (query.action) filter.action = query.action;
    if (query.userId) filter.user = query.userId;

    const [data, total] = await Promise.all([
      (await AuditLog.find(filter).populate("user", "name email").skip(skip).limit(limit)).toSorted(
        { createdAt: -1 }
      ),
      AuditLog.countDocuments(filter),
    ]);

    return formatPaginateResponse(data, total, page, limit);
  },
};
