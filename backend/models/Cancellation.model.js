import mongoose from "mongoose";

const cancellationSchema = new mongoose.Schema(
  {
    // 🔗 BOOKING LINK
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
      unique: true, // ek booking ka ek hi cancellation record
      index: true,
    },

    // 👤 WHO CANCELLED
    cancelledBy: {
      type: String,
      enum: ["customer", "provider", "admin", "system"],
      required: true,
      index: true,
    },

    // 🔗 USER (jisne action liya – optional)
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },

    // 🧠 REASON
    reason: {
      type: String,
      required: true,
      trim: true,
    },

    // 🕒 TIMING (booking ke kitne time pehle cancel hua)
    cancelledAt: {
      type: Date,
      default: Date.now,
      index: true,
    },

    hoursBeforeService: {
      type: Number, // e.g. 12 hours before slot
      min: 0,
    },

    // 💸 REFUND POLICY SNAPSHOT
    refundPolicy: {
      isRefundable: {
        type: Boolean,
        default: true,
      },
      refundPercentage: {
        type: Number, // 0–100
        min: 0,
        max: 100,
        default: 100,
      },
      penaltyAmount: {
        type: Number, // flat penalty if any
        default: 0,
        min: 0,
      },
    },

    // 💰 REFUND CALCULATION
    amounts: {
      bookingAmount: {
        type: Number,
        required: true,
        min: 0,
      },
      refundableAmount: {
        type: Number,
        required: true,
        min: 0,
      },
      refundedAmount: {
        type: Number,
        default: 0,
        min: 0,
      },
      currency: {
        type: String,
        default: "INR",
      },
    },

    // 💳 PAYMENT / WALLET LINKS
    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
      index: true,
    },

    walletTransaction: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WalletTransaction",
    },

    // 🟢 STATUS
    status: {
      type: String,
      enum: ["pending", "processed", "rejected"],
      default: "pending",
      index: true,
    },

    processedAt: {
      type: Date,
    },

    processedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // admin
    },

    // 📝 NOTES (admin / system)
    notes: {
      type: String,
      trim: true,
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
cancellationSchema.index({ status: 1, cancelledAt: -1 });
cancellationSchema.index({ cancelledBy: 1 });

// 🧠 METHODS

// Mark refund processed
cancellationSchema.methods.markProcessed = function ({
  refundedAmount,
  walletTransaction,
  processedBy,
}) {
  this.status = "processed";
  this.amounts.refundedAmount = refundedAmount;
  this.walletTransaction = walletTransaction;
  this.processedAt = new Date();
  this.processedBy = processedBy;
  return this.save();
};

const Cancellation = mongoose.model(
  "Cancellation",
  cancellationSchema
);

export default Cancellation;
