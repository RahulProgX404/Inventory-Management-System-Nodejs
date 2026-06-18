import mongoose from "mongoose";
import { PurchaseStatus } from "../../utils/enum";

const purchaseOrderSchema = new mongoose.Schema(
  {
    supplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Supplier",
    },

    status: {
      type: String,
      enum: Object.values(PurchaseStatus),
      default: PurchaseStatus.DRAFT,
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
  {
    timestamps: true,
  }
);

const PurchaseOrder = mongoose.model("PurchaseOrder", purchaseOrderSchema);
export default PurchaseOrder;
