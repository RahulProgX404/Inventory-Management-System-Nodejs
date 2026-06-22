import { StatusCodes } from "http-status-codes";
import { asyncHandler } from "../../utils/async-handler.js";
import { auditLogService } from "./auditLog.service.js";

export const getAuditLogs = asyncHandler(async (req, res) => {
  const result = await auditLogService.findAll(req.query);
  return res.success(result, "Audit logs retrieved successfully", StatusCodes.OK);
});
