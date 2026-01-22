import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    // 🔗 USER (payer / owner)
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // 🔗 WALLET (optional – wallet topup / settlement)
    wallet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Wallet",
      index: true,
    },

    // 🔗 LINKED ENTITIES (one of them)
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      index: true,
    },

    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      index: true,
    },

    subscription: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subscription",
      index: true,
    },

    // 💳 PAYMENT AMOUNT
    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    currency: {
      type: String,
      default: "INR",
    },

    // 🏦 GATEWAY INFO
    gateway: {
      type: String,
      enum: ["razorpay", "stripe", "paypal", "wallet"],
      required: true,
      index: true,
    },

    gatewayOrderId: {
      type: String,
      index: true,
    },

    gatewayPaymentId: {
      type: String,
      index: true,
    },

    gatewaySignature: {
      type: String,
      select: false,
    },

    // 🧾 PAYMENT PURPOSE
    purpose: {
      type: String,
      enum: [
        "order_payment",
        "booking_payment",
        "subscription_payment",
        "wallet_topup",
        "penalty",
        "other",
      ],
      required: true,
      index: true,
    },

    // 🟢 STATUS
    status: {
      type: String,
      enum: [
        "created",
        "pending",
        "authorized",
        "captured",
        "success",
        "failed",
        "refunded",
      ],
      default: "created",
      index: true,
    },

    // 🔁 REFUND INFO
    refund: {
      isRefunded: {
        type: Boolean,
        default: false,
      },
      refundAmount: {
        type: Number,
        default: 0,
      },
      refundAt: {
        type: Date,
      },
      refundGatewayId: {
        type: String,
      },
    },

    // 🔔 WEBHOOK / META
    webhookPayload: {
      type: Object,
    },

    failureReason: {
      type: String,
      trim: true,
    },

    // 🟢 FLAGS
    isSettled: {
      type: Boolean,
      default: false,
      index: true,
    },

    settledAt: {
      type: Date,
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

// 🔍 INDEXES (fast queries & reports)
paymentSchema.index({ user: 1, createdAt: -1 });
paymentSchema.index({ gateway: 1, status: 1 });
paymentSchema.index({ purpose: 1, status: 1 });

// 🧠 METHODS

// Mark payment success
paymentSchema.methods.markSuccess = function () {
  this.status = "success";
  return this.save();
};

// Mark payment failed
paymentSchema.methods.markFailed = function (reason) {
  this.status = "failed";
  this.failureReason = reason;
  return this.save();
};

// Mark refunded
paymentSchema.methods.markRefunded = function (amount) {
  this.status = "refunded";
  this.refund.isRefunded = true;
  this.refund.refundAmount = amount;
  this.refund.refundAt = new Date();
  return this.save();
};

const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;
