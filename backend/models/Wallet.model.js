import mongoose from "mongoose";

const walletSchema = new mongoose.Schema(
  {
    // 🔗 OWNER (User)
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },

    // 💰 BALANCE
    balance: {
      type: Number,
      default: 0,
      min: 0,
    },

    currency: {
      type: String,
      default: "INR",
    },

    // 🧮 TOTAL STATS (analytics / safety)
    totalCredit: {
      type: Number,
      default: 0,
    },

    totalDebit: {
      type: Number,
      default: 0,
    },

    // 🟢 STATUS
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },

    isBlocked: {
      type: Boolean,
      default: false,
    },

    blockedReason: {
      type: String,
    },

    // 🏦 SETTLEMENT INFO (for sellers / providers)
    settlementAccount: {
      bankName: String,
      accountHolderName: String,
      accountNumber: String,
      ifsc: String,
      upiId: String,
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
walletSchema.index({ user: 1, isActive: 1 });

// 🧠 METHODS

// Credit money
walletSchema.methods.credit = function (amount) {
  this.balance += amount;
  this.totalCredit += amount;
  return this.save();
};

// Debit money
walletSchema.methods.debit = function (amount) {
  if (this.balance < amount) {
    throw new Error("Insufficient wallet balance");
  }
  this.balance -= amount;
  this.totalDebit += amount;
  return this.save();
};

const Wallet = mongoose.model("Wallet", walletSchema);

export default Wallet;
