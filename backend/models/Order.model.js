import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    // 👤 CUSTOMER
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // 🏷️ ORDER META
    orderNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
      /*
        Example:
        ORD-2026-000123
      */
    },

    // 🏠 SHIPPING ADDRESS
    shippingAddress: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
      required: true,
    },

    // 🛒 ORDER ITEMS (snapshot)
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },

        productVariant: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "ProductVariant",
        },

        seller: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },

        quantity: {
          type: Number,
          required: true,
          min: 1,
        },

        pricing: {
          mrp: Number,
          sellingPrice: Number,
          currency: {
            type: String,
            default: "INR",
          },
        },

        tax: {
          hsn: String,
          gstPercentage: Number,
        },

        totalPrice: {
          type: Number,
          required: true,
        },
      },
    ],

    // 💰 TOTALS
    totals: {
      subTotal: {
        type: Number,
        required: true,
      },
      discount: {
        type: Number,
        default: 0,
      },
      tax: {
        type: Number,
        default: 0,
      },
      shipping: {
        type: Number,
        default: 0,
      },
      grandTotal: {
        type: Number,
        required: true,
      },
      currency: {
        type: String,
        default: "INR",
      },
    },

    // 💳 PAYMENT
    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
      index: true,
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
      index: true,
    },

    // 🚚 SHIPMENT
    shipment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shipment",
    },

    // 🟢 ORDER STATUS
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
      ],
      default: "pending",
      index: true,
    },

    // ❌ CANCELLATION
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

    // 🧾 INVOICE
    invoice: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Invoice",
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
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ status: 1, paymentStatus: 1 });

// 🧠 METHODS

// Cancel order
orderSchema.methods.cancel = function (reason) {
  this.status = "cancelled";
  this.cancellation = {
    reason,
    cancelledAt: new Date(),
  };
  return this.save();
};

const Order = mongoose.model("Order", orderSchema);

export default Order;
