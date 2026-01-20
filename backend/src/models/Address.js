const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    type: {
      type: String,
      enum: ["HOME", "OFFICE", "PICKUP"],
      required: true
    },

    name: {
      type: String,
      trim: true
    },

    phone: {
      type: String
    },

    addressLine1: {
      type: String,
      required: true
    },

    addressLine2: {
      type: String
    },

    city: {
      type: String,
      required: true
    },

    state: {
      type: String,
      required: true
    },

    pincode: {
      type: String,
      required: true
    },

    country: {
      type: String,
      default: "India"
    },

    isDefault: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Address", addressSchema);
