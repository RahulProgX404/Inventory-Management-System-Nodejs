import { Router } from "express";
import { getAuditLogs } from "./auditLog.controller.js";
import { enforceAuthorization } from "../../utils/permissions.js";

export const auditLogRouter = Router();

auditLogRouter.get("/", ...enforceAuthorization(["admin", ["audit-logs.read"]]), getAuditLogs);
