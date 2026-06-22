import { Router } from "express";
import { getAuditLogs } from "./auditLog.controller";
import { enforceAuthorization } from "../../utils/permissions";

export const auditLogRouter = Router();

auditLogRouter.get("/", ...enforceAuthorization(["admin", ["audit-logs.read"]]), getAuditLogs);
