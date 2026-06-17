import { randomUUID } from "node:crypto";

export function requestIdMiddleware(req, res, next) {
  const requestId = req.headers["x-request-id"] || randomUUID();
  req.id = requestId;
  res.setHeader("x-request-id", requestId);
  next();
}
