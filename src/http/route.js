import { Router } from "express";

import { healthRouter } from "../modules/health/health.route.js";
import { userRouter } from "../modules/users/user.route.js";
import { categoryRouter } from "../modules/categories/category.route.js";
import { inventoryRouter } from "../modules/inventory/inventory.route.js";
import { auditLogRouter } from "../modules/audit-logs/auditLog.route.js";
import { productRouter } from "../modules/products/product.route.js";
import { warehouseRouter } from "../modules/warehouses/warehouse.route.js";
import { supplierRouter } from "../modules/suppliers/supplier.route.js";
import { purchaseOrderRouter } from "../modules/purchase-orders/purchaseOrder.route.js";
import { salesOrderRouter } from "../modules/sales-orders/salesOrder.route.js";
import { reportRouter } from "../modules/reports/report.route.js";
import { notificationRouter } from "../modules/notifications/notification.route.js";

export const router = Router();

router.use("/health", healthRouter);
router.use("/users", userRouter);
router.use("/audit-logs", auditLogRouter);
router.use("/categories", categoryRouter);
router.use("/inventories", inventoryRouter);
router.use("/products", productRouter);
router.use("/warehouses", warehouseRouter);
router.use("/suppliers", supplierRouter);
router.use("/purchase-orders", purchaseOrderRouter);
router.use("/sales-orders", salesOrderRouter);
router.use("/reports", reportRouter);
router.use("/notifications", notificationRouter);
