const mongoose = require("mongoose");

const homeServiceProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },

    providerName: {
      type: String,
      required: true,
      trim: true
    },

    serviceCategoryIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true
      }
    ],

    serviceArea: {
      city: String,
      state: String,
      pincodes: [String]
    },

    experienceYears: {
      type: Number,
      default: 0
    },

    documents: [
      {
        type: String // aadhaar, certificate, etc (URL)
      }
    ],

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
  "HomeServiceProfile",
  homeServiceProfileSchema
);
