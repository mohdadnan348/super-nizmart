import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
  {
    // 🔗 USER LINK (seller / provider / owner etc.)
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // 📦 PLAN INFO
    planName: {
      type: String,
      required: true,
      trim: true,
      /*
        Examples:
        FREE
        PRO
        ENTERPRISE
      */
    },

    planCode: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
      index: true,
      /*
        FREE, PRO, ENTERPRISE
      */
    },

    // 💰 PRICING
    price: {
      type: Number,
      default: 0, // FREE plan = 0
      min: 0,
    },

    currency: {
      type: String,
      default: "INR",
    },

    billingCycle: {
      type: String,
      enum: ["monthly", "quarterly", "yearly"],
      default: "monthly",
    },

    // 📅 VALIDITY
    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
      required: true,
      index: true,
    },

    // 🔁 RENEWAL
    autoRenew: {
      type: Boolean,
      default: false,
    },

    renewedFrom: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subscription",
    },

    // 🎯 FEATURES / LIMITS
    features: {
      type: [String],
      default: [],
      /*
        Example:
        ["reduced_commission", "featured_listing", "advanced_analytics"]
      */
    },

    limits: {
      listings: {
        type: Number, // max products / services
      },
      bookingsPerMonth: {
        type: Number,
      },
      teamMembers: {
        type: Number,
      },
    },

    // 💸 COMMISSION OVERRIDE (VERY IMPORTANT)
    commissionPercentage: {
      type: Number,
      min: 0,
      max: 100,
      /*
        If null → use default commission
      */
    },

    // 💳 PAYMENT LINK
    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
    },

    // 🟢 STATUS
    status: {
      type: String,
      enum: ["active", "expired", "cancelled", "pending"],
      default: "active",
      index: true,
    },

    cancelledAt: {
      type: Date,
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
subscriptionSchema.index({ user: 1, status: 1 });
subscriptionSchema.index({ endDate: 1 });

// 🧠 METHODS

// Check subscription active or not
subscriptionSchema.methods.isActive = function () {
  return this.status === "active" && this.endDate > new Date();
};

const Subscription = mongoose.model("Subscription", subscriptionSchema);

export default Subscription;
