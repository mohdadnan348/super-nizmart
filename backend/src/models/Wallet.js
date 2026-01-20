const mongoose = require("mongoose");

const walletSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },

    balance: {
      type: Number,
      default: 0
    },

    transactions: [
      {
        type: {
          type: String,
          enum: ["CREDIT", "DEBIT"],
          required: true
        },

        amount: {
          type: Number,
          required: true
        },

        reason: {
          type: String
        },

        referenceType: {
          type: String,
          enum: ["ORDER", "SERVICE_BOOKING", "SUBSCRIPTION", "REFUND"]
        },

        referenceId: {
          type: mongoose.Schema.Types.ObjectId
        },

        createdAt: {
          type: Date,
          default: Date.now
        }
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Wallet", walletSchema);
