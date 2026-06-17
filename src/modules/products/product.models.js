import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    sku: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    barcode: {
      type: String,
      unique: true,
      sparse: true,
    },

    description: String,

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    supplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Supplier",
    },

    unitPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    currentStock: {
      type: Number,
      default: 0,
    },

    reorderLevel: {
      type: Number,
      default: 10,
    },

    image: String,

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
