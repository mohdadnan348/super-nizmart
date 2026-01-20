const mongoose = require("mongoose");

const homeServiceSchema = new mongoose.Schema(
  {
    providerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    profileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "HomeServiceProfile",
      required: true
    },

    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true
    },

    title: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String
    },

    priceType: {
      type: String,
      enum: ["FIXED", "HOURLY"],
      required: true
    },

    price: {
      type: Number,
      required: true
    },

    availability: {
      type: Boolean,
      default: true
    },

    isApproved: {
      type: Boolean,
      default: false
    },

    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE"],
      default: "INACTIVE"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("HomeService", homeServiceSchema);
