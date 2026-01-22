import mongoose from "mongoose";

const inventorySchema = new mongoose.Schema(
  {
    // 🔗 PRODUCT LINKS
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true,
    },

    productVariant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductVariant",
      index: true,
    },

    // 👤 SELLER
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // 🏭 WAREHOUSE / LOCATION
    warehouse: {
      name: {
        type: String,
        required: true,
        trim: true,
      },
      address: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Address",
      },
      code: {
        type: String,
        trim: true,
        index: true,
      },
    },

    // 📦 STOCK DETAILS
    stock: {
      available: {
        type: Number,
        default: 0,
        min: 0,
      },
      reserved: {
        type: Number,
        default: 0,
        min: 0,
      },
      damaged: {
        type: Number,
        default: 0,
        min: 0,
      },
    },

    lowStockThreshold: {
      type: Number,
      default: 5,
    },

    // 🔁 MOVEMENT TRACKING (optional summary)
    lastUpdatedReason: {
      type: String,
      enum: [
        "initial",
        "order_placed",
        "order_cancelled",
        "order_returned",
        "manual_adjustment",
        "restock",
      ],
      default: "initial",
    },

    // 🟢 STATUS
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },

    // 🗑️ SOFT DELETE
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// 🔍 INDEXES
inventorySchema.index({
  product: 1,
  productVariant: 1,
  seller: 1,
});
inventorySchema.index({ "warehouse.code": 1 });
inventorySchema.index({ isActive: 1 });

// 🧠 METHODS

// Reserve stock (when order placed)
inventorySchema.methods.reserveStock = function (qty) {
  if (this.stock.available < qty) {
    throw new Error("Insufficient inventory stock");
  }
  this.stock.available -= qty;
  this.stock.reserved += qty;
  this.lastUpdatedReason = "order_placed";
  return this.save();
};

// Release stock (order cancelled)
inventorySchema.methods.releaseStock = function (qty) {
  this.stock.available += qty;
  this.stock.reserved -= qty;
  this.lastUpdatedReason = "order_cancelled";
  return this.save();
};

// Deduct reserved stock (order shipped)
inventorySchema.methods.commitStock = function (qty) {
  if (this.stock.reserved < qty) {
    throw new Error("Insufficient reserved stock");
  }
  this.stock.reserved -= qty;
  this.lastUpdatedReason = "order_shipped";
  return this.save();
};

const Inventory = mongoose.model("Inventory", inventorySchema);

export default Inventory;
