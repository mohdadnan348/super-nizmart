const mongoose = require("mongoose");

const commissionSchema = new mongoose.Schema(
  {
    module: {
      type: String,
      enum: ["B2C", "B2B", "HOME_SERVICE"],
      required: true
    },

    subscriptionName: {
      type: String,
      enum: ["FREE", "PRO", "ENTERPRISE"],
      required: true
    },

    commissionPercent: {
      type: Number,
      required: true
    },

    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Commission", commissionSchema);
