import mongoose from "mongoose";

const walletTransactionSchema = new mongoose.Schema(
  {
    // 🔗 WALLET LINK
    wallet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Wallet",
      required: true,
      index: true,
    },

    // 🔗 USER (redundant index for fast queries)
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // 💱 TRANSACTION TYPE
    type: {
      type: String,
      enum: ["credit", "debit"],
      required: true,
      index: true,
    },

    // 🏷️ SOURCE / PURPOSE (VERY IMPORTANT)
    purpose: {
      type: String,
      enum: [
        "order_payment",
        "order_refund",
        "booking_payment",
        "booking_refund",
        "commission",
        "earning",
        "payout",
        "wallet_topup",
        "adjustment",
      ],
      required: true,
      index: true,
    },

    // 💰 AMOUNT
    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    currency: {
      type: String,
      default: "INR",
    },

    // 🧮 BALANCE SNAPSHOT (audit ke liye)
    openingBalance: {
      type: Number,
      required: true,
    },

    closingBalance: {
      type: Number,
      required: true,
    },

    // 🔗 REFERENCE ENTITIES
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
    },

    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
    },

    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
    },

    // 🧾 DESCRIPTION
    description: {
      type: String,
      trim: true,
    },

    // 🟢 STATUS
    status: {
      type: String,
      enum: ["pending", "completed", "failed", "reversed"],
      default: "completed",
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

// 🔍 INDEXES (performance & reporting)
walletTransactionSchema.index({ wallet: 1, createdAt: -1 });
walletTransactionSchema.index({ user: 1, createdAt: -1 });
walletTransactionSchema.index({ purpose: 1, createdAt: -1 });

// 🧠 STATIC: CREATE TRANSACTION SAFELY
walletTransactionSchema.statics.createTransaction = async function ({
  wallet,
  user,
  type,
  purpose,
  amount,
  openingBalance,
  order,
  booking,
  payment,
  description,
}) {
  const closingBalance =
    type === "credit"
      ? openingBalance + amount
      : openingBalance - amount;

  return this.create({
    wallet,
    user,
    type,
    purpose,
    amount,
    openingBalance,
    closingBalance,
    order,
    booking,
    payment,
    description,
  });
};

const WalletTransaction = mongoose.model(
  "WalletTransaction",
  walletTransactionSchema
);

export default WalletTransaction;
