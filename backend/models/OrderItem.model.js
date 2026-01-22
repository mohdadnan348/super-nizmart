import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    // 🔗 ORDER LINK
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
      index: true,
    },

    // 👤 CUSTOMER (fast queries)
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // 👤 SELLER
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // 🛍️ PRODUCT INFO (snapshot)
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    productVariant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductVariant",
    },

    productName: {
      type: String,
      required: true,
      trim: true,
    },

    sku: {
      type: String,
      trim: true,
      index: true,
    },

    // 📦 QUANTITY
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    // 💰 PRICING SNAPSHOT
    pricing: {
      mrp: {
        type: Number,
        required: true,
      },
      sellingPrice: {
        type: Number,
        required: true,
      },
      taxAmount: {
        type: Number,
        default: 0,
      },
      currency: {
        type: String,
        default: "INR",
      },
    },

    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    // 🧾 TAX SNAPSHOT
    tax: {
      hsn: String,
      gstPercentage: Number,
    },

    // 🚚 ITEM-LEVEL STATUS
    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "packed",
        "shipped",
        "delivered",
        "cancelled",
        "returned",
        "refunded",
      ],
      default: "pending",
      index: true,
    },

    // 🚚 SHIPMENT (item-wise split possible)
    shipment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shipment",
    },

    // ❌ CANCELLATION (item-level)
    cancellation: {
      reason: String,
      cancelledAt: Date,
    },

    // 🔁 RETURN
    return: {
      requestedAt: Date,
      reason: String,
      status: {
        type: String,
        enum: ["requested", "approved", "rejected", "completed"],
      },
    },

    // 💸 REFUND
    refund: {
      amount: {
        type: Number,
      },
      refundedAt: {
        type: Date,
      },
      payment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Payment",
      },
    },

    // 🧾 INVOICE (optional – item-wise)
    invoice: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Invoice",
    },

    // 🟢 FLAGS
    isCommissionApplied: {
      type: Boolean,
      default: false,
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
orderItemSchema.index({ order: 1 });
orderItemSchema.index({ seller: 1, status: 1 });
orderItemSchema.index({ user: 1, createdAt: -1 });

// 🧠 METHODS

// Mark item delivered
orderItemSchema.methods.markDelivered = function () {
  this.status = "delivered";
  return this.save();
};

// Cancel item
orderItemSchema.methods.cancel = function (reason) {
  this.status = "cancelled";
  this.cancellation = {
    reason,
    cancelledAt: new Date(),
  };
  return this.save();
};

const OrderItem = mongoose.model("OrderItem", orderItemSchema);

export default OrderItem;
