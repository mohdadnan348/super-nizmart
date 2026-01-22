import mongoose from "mongoose";

const shipmentSchema = new mongoose.Schema(
  {
    // 🔗 ORDER LINK
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
      index: true,
    },

    // 🔗 ORDER ITEMS (partial shipment support)
    orderItems: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "OrderItem",
        index: true,
      },
    ],

    // 👤 CUSTOMER
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // 👤 SELLER (marketplace)
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // 🏠 SHIPPING ADDRESS SNAPSHOT
    shippingAddress: {
      name: String,
      phone: String,
      addressLine1: String,
      addressLine2: String,
      city: String,
      state: String,
      pincode: String,
      country: {
        type: String,
        default: "India",
      },
    },

    // 🚚 COURIER / PARTNER
    courier: {
      name: {
        type: String, // Shiprocket / Delhivery etc.
        index: true,
      },
      serviceType: {
        type: String, // surface / air
      },
      awb: {
        type: String,
        index: true,
      },
      trackingUrl: {
        type: String,
      },
    },

    // 🧾 SHIPMENT META
    shipmentType: {
      type: String,
      enum: ["forward", "reverse"],
      default: "forward",
      index: true,
    },

    // 💰 COD INFO
    cod: {
      isCod: {
        type: Boolean,
        default: false,
        index: true,
      },
      amount: {
        type: Number,
        default: 0,
      },
    },

    // 📦 PACKAGE DETAILS
    package: {
      weight: Number, // grams
      dimensions: {
        length: Number,
        width: Number,
        height: Number,
      },
    },

    // 🟢 STATUS FLOW
    status: {
      type: String,
      enum: [
        "created",
        "label_generated",
        "picked_up",
        "in_transit",
        "out_for_delivery",
        "delivered",
        "failed",
        "rto",
        "returned",
      ],
      default: "created",
      index: true,
    },

    // ⏱️ IMPORTANT DATES
    shippedAt: Date,
    deliveredAt: Date,
    returnedAt: Date,

    // 🔔 TRACKING HISTORY
    trackingHistory: [
      {
        status: String,
        location: String,
        message: String,
        time: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    // 💳 SHIPPING CHARGES
    charges: {
      shipping: {
        type: Number,
        default: 0,
      },
      cod: {
        type: Number,
        default: 0,
      },
      total: {
        type: Number,
        default: 0,
      },
      currency: {
        type: String,
        default: "INR",
      },
    },

    // 🔗 RETURN / RTO LINK
    return: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Return",
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
shipmentSchema.index({ seller: 1, status: 1 });
shipmentSchema.index({ "courier.awb": 1 });
shipmentSchema.index({ shipmentType: 1, status: 1 });

// 🧠 METHODS

// Update shipment status
shipmentSchema.methods.updateStatus = function (status, message, location) {
  this.status = status;
  this.trackingHistory.push({
    status,
    message,
    location,
  });

  if (status === "delivered") {
    this.deliveredAt = new Date();
  }

  return this.save();
};

const Shipment = mongoose.model("Shipment", shipmentSchema);

export default Shipment;
