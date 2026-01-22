import mongoose from "mongoose";

const refundSchema = new mongoose.Schema(
  {
    // 👤 CUSTOMER
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // 🔗 SOURCE (one of them)
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      index: true,
    },

    orderItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "OrderItem",
      index: true,
    },

    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      index: true,
    },

    return: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Return",
      index: true,
    },

    cancellation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cancellation",
      index: true,
    },

    // 💳 PAYMENT LINK
    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
      index: true,
    },

    // 💰 REFUND AMOUNT
    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    currency: {
      type: String,
      default: "INR",
    },

    // 🔁 REFUND METHOD
    method: {
      type: String,
      enum: ["original", "wallet"],
      default: "original",
      index: true,
      /*
        original = same payment gateway
        wallet = platform wallet
      */
    },

    // 🏦 GATEWAY REFUND INFO
    gateway: {
      type: String,
      enum: ["razorpay", "stripe", "paypal", "wallet"],
      index: true,
    },

    gatewayRefundId: {
      type: String,
      index: true,
    },

    // 🟢 STATUS
    status: {
      type: String,
      enum: ["initiated", "processing", "completed", "failed"],
      default: "initiated",
      index: true,
    },

    // 🕒 TIMESTAMPS
    initiatedAt: {
      type: Date,
      default: Date.now,
    },

    processedAt: {
      type: Date,
    },

    // 🔗 WALLET TX (if wallet refund)
    walletTransaction: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WalletTransaction",
    },

    // 🧠 FAILURE / NOTES
    failureReason: {
      type: String,
      trim: true,
    },

    notes: {
      type: String,
      trim: true,
    },

    // 🧑‍💼 ADMIN
    processedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
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
refundSchema.index({ user: 1, createdAt: -1 });
refundSchema.index({ status: 1, method: 1 });
refundSchema.index({ gateway: 1 });

// 🧠 METHODS

// Mark refund completed
refundSchema.methods.markCompleted = function ({
  gatewayRefundId,
  walletTransaction,
}) {
  this.status = "completed";
  this.gatewayRefundId = gatewayRefundId || this.gatewayRefundId;
  this.walletTransaction = walletTransaction || this.walletTransaction;
  this.processedAt = new Date();
  return this.save();
};

// Mark refund failed
refundSchema.methods.markFailed = function (reason) {
  this.status = "failed";
  this.failureReason = reason;
  this.processedAt = new Date();
  return this.save();
};

const Refund = mongoose.model("Refund", refundSchema);

export default Refund;
