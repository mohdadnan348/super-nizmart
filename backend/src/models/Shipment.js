const mongoose = require("mongoose");

const shipmentSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true
    },

    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    courierName: {
      type: String
    },

    shiprocketOrderId: {
      type: String
    },

    awbCode: {
      type: String
    },

    pickupScheduled: {
      type: Boolean,
      default: false
    },

    trackingUrl: {
      type: String
    },

    status: {
      type: String,
      enum: [
        "CREATED",
        "PICKUP_SCHEDULED",
        "IN_TRANSIT",
        "DELIVERED",
        "CANCELLED"
      ],
      default: "CREATED"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Shipment", shipmentSchema);
