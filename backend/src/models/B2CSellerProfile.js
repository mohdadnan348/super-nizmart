const mongoose = require("mongoose");

const b2cSellerProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },

    storeName: {
      type: String,
      required: true,
      trim: true
    },

    gstNumber: {
      type: String,
      trim: true
    },

    pickupAddressId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
      required: true
    },

    bankDetails: {
      accountHolderName: String,
      accountNumber: String,
      ifscCode: String
    },

    logo: {
      type: String
    },

    subscriptionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subscription"
    },

    isVerified: {
      type: Boolean,
      default: false
    },

    status: {
      type: String,
      enum: ["PENDING", "ACTIVE", "REJECTED"],
      default: "PENDING"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "B2CSellerProfile",
  b2cSellerProfileSchema
);
