import mongoose from "mongoose";
import { TransactionStatus } from "../../utils/enum";

const inventoryTransactionSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    warehouse: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Warehouse",
      required: true,
    },

    type: {
      type: String,
      enum: Object.values(TransactionStatus),
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
    },

    reference: {
      type: String,
    },

    notes: String,

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const InventoryTransaction = mongoose.model("InventoryTransaction", inventoryTransactionSchema);
export default InventoryTransaction;
