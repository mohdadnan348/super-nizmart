const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    referenceType: {
      type: String,
      enum: ["ORDER", "SERVICE_BOOKING", "SUBSCRIPTION"],
      required: true
    },

    referenceId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },

    amount: {
      type: Number,
      required: true
    },

    currency: {
      type: String,
      default: "INR"
    },

    paymentGateway: {
      type: String,
      enum: ["RAZORPAY", "STRIPE", "PAYPAL"]
    },

    transactionId: {
      type: String
    },

    status: {
      type: String,
      enum: ["PENDING", "SUCCESS", "FAILED", "REFUNDED"],
      default: "PENDING"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);
