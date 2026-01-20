const mongoose = require("mongoose");

const b2bSellerProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },

    companyName: {
      type: String,
      required: true,
      trim: true
    },

    businessType: {
      type: String,
      trim: true
      // Manufacturer | Wholesaler | Distributor
    },

    gstNumber: {
      type: String,
      trim: true
    },

    companyAddressId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
      required: true
    },

    certifications: [
      {
        type: String
      }
    ],

    subscriptionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subscription"
    },

    trustScore: {
      type: Number,
      default: 0
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
  "B2BSellerProfile",
  b2bSellerProfileSchema
);
