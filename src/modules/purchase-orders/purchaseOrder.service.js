import { StatusCodes } from "http-status-codes";
import { AppError } from "../../utils/app-error";
import PurchaseOrder from "./purchaseOrder.model";
import { PurchaseStatus, SalesOrderStatus } from "../../utils/enum";
import { inventoryService } from "../inventory/inventory.service";
import SalesOrder from "../sales-orders/salesOrder.model";

async function getPurchaseOrder(poId) {
  const po = await PurchaseOrder.findById(poId);
  if (!po) throw new AppError("Purchase order not found", StatusCodes.NOT_FOUND);
  return po;
}

export const purchaseOrderService = {
  async receivePurchaseOrder(poId) {
    const purchaseOrder = await getPurchaseOrder(poId);
    if (purchaseOrder.status === PurchaseStatus.RECEIVED)
      throw new AppError("Already received", StatusCodes.BAD_REQUEST);

    for (const item of purchaseOrder.items) {
      await inventoryService.stockIn({
        productId: item.product,
        quantity: item.quantity,
        warehouseId: purchaseOrder.warehouseId,
      });
    }

    purchaseOrder.status = PurchaseStatus.RECEIVED;
    await purchaseOrder.save();

    return purchaseOrder;
  },

  async confirmOrder(orderId) {
    const order = await SalesOrder.findById(orderId);

    for (const item of order.items) {
      await inventoryService.stockOut({
        productId: item.product,
        quantity: item.quantity,
        warehouseId: order.warehouse,
      });
    }

    order.status = SalesOrderStatus.CONFIRMED;
    order.save();

    return order;
  },
};
