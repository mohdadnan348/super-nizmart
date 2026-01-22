import mongoose from "mongoose";

const commissionSchema = new mongoose.Schema(
  {
    // 🔗 USER (jis se commission kata)
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // 🔗 PLATFORM EARNING (admin wallet optional)
    platformWallet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Wallet",
    },

    // 🔗 SOURCE ENTITY (one of them)
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

    // 📌 SERVICE TYPE (important for analytics)
    serviceType: {
      type: String,
      enum: [
        "b2c",
        "b2b",
        "service",
        "restaurant",
        "hotel",
        "doctor",
        "advocate",
        "driver",
        "bike",
        "cinema",
        "property",
        "subscription",
      ],
      required: true,
      index: true,
    },

    // 💰 AMOUNTS
    grossAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    commissionPercentage: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },

    commissionAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    netAmount: {
      type: Number,
      required: true,
      min: 0,
      /*
        grossAmount - commissionAmount
      */
    },

    currency: {
      type: String,
      default: "INR",
    },

    // 🟢 STATUS
    status: {
      type: String,
      enum: ["pending", "applied", "reversed"],
      default: "applied",
      index: true,
    },

    // 🔁 REVERSAL (refund / cancellation)
    reversedAt: {
      type: Date,
    },

    reversedReason: {
      type: String,
      trim: true,
    },

    // 🔗 PAYMENT / WALLET LINK
    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
    },

    walletTransaction: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WalletTransaction",
    },

    // 🧠 SOURCE CONFIG (default / subscription override)
    source: {
      type: String,
      enum: ["default", "subscription", "manual"],
      default: "default",
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

// 🔍 INDEXES (reporting & performance)
commissionSchema.index({ user: 1, createdAt: -1 });
commissionSchema.index({ serviceType: 1, status: 1 });
commissionSchema.index({ order: 1 });
commissionSchema.index({ booking: 1 });

// 🧠 METHODS

// Reverse commission (refund / cancel case)
commissionSchema.methods.reverse = function (reason) {
  this.status = "reversed";
  this.reversedAt = new Date();
  this.reversedReason = reason;
  return this.save();
};

const Commission = mongoose.model("Commission", commissionSchema);

export default Commission;
