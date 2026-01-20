const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      unique: true
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    orderType: {
      type: String,
      enum: ["B2C", "B2B"],
      required: true
    },

    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product"
        },
        quantity: Number,
        price: Number,
        totalPrice: Number
      }
    ],

    subTotal: {
      type: Number,
      required: true
    },

    shippingCharges: {
      type: Number,
      default: 0
    },

    totalAmount: {
      type: Number,
      required: true
    },

    shippingAddressId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
      required: true
    },

    paymentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment"
    },

    shipmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shipment"
    },

    status: {
      type: String,
      enum: [
        "PLACED",
        "CONFIRMED",
        "SHIPPED",
        "DELIVERED",
        "CANCELLED"
      ],
      default: "PLACED"
    }
  },
  { timestamps: true }
);

/**
 * 🔢 AUTO ORDER NUMBER
 */
orderSchema.pre("save", function (next) {
  if (!this.orderNumber) {
    this.orderNumber = "ORD-" + Date.now();
  }
  next();
});

module.exports = mongoose.model("Order", orderSchema);
