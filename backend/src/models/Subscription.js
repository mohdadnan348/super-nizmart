const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      enum: ["FREE", "PRO", "ENTERPRISE"]
    },

    price: {
      type: Number,
      default: 0 // FREE = 0
    },

    durationDays: {
      type: Number,
      required: true // eg: 30, 90, 365
    },

    applicableFor: [
      {
        type: String,
        enum: ["B2C_SELLER", "B2B_SELLER", "HOME_SERVICE_PROVIDER"]
      }
    ],

    features: {
      // flexible JSON for limits & permissions
      type: Object,
      default: {}
      /*
        example:
        {
          maxProducts: 50,
          maxOrdersPerMonth: 100,
          commissionPercent: 10,
          priorityListing: true
        }
      */
    },

    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Subscription", subscriptionSchema);
