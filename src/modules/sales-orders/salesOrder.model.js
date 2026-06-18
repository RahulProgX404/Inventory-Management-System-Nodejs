import mongoose from "mongoose";
import { SalesStatus } from "../../utils/enum";

const salesOrderSchema = new mongoose.Schema(
  {
    customerName: String,
    status: {
      type: String,
      enum: Object.values(SalesStatus),
      default: SalesStatus.PENDING,
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        quantity: Number,
        unitPrice: Number,
      },
    ],
    totalAmount: Number,
  },
  { timestamps: true }
);

const SalesOrder = mongoose.model("SaleOrder", salesOrderSchema);
export default SalesOrder;
