import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
  {
    // 🏷️ BASIC INFO
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
    },

    title: {
      type: String,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    // 🎯 APPLICABLE ON
    applicableOn: {
      type: String,
      enum: ["order", "booking", "subscription", "wallet"],
      required: true,
      index: true,
    },

    // 💸 DISCOUNT TYPE
    discountType: {
      type: String,
      enum: ["flat", "percentage"],
      required: true,
    },

    discountValue: {
      type: Number,
      required: true,
      min: 0,
    },

    maxDiscountAmount: {
      type: Number, // for percentage coupons
      min: 0,
    },

    // 💰 CONDITIONS
    minOrderAmount: {
      type: Number,
      default: 0,
    },

    // 👥 USER RESTRICTIONS
    usageLimit: {
      total: {
        type: Number, // total times coupon can be used
      },
      perUser: {
        type: Number,
        default: 1,
      },
    },

    usedCount: {
      type: Number,
      default: 0,
    },

    // 🧩 USER TYPE / ROLE
    allowedRoles: [
      {
        type: String,
        enum: [
          "customer",
          "service-provider",
          "seller-b2c",
          "seller-b2b",
        ],
      },
    ],

    // 🗂️ CATEGORY / SERVICE FILTER (optional)
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ServiceCategory",
    },

    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
    },

    // 📅 VALIDITY
    startDate: {
      type: Date,
      required: true,
      index: true,
    },

    endDate: {
      type: Date,
      required: true,
      index: true,
    },

    // 🟢 STATUS
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },

    isPublic: {
      type: Boolean,
      default: true,
    },

    // 👤 CREATED BY
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    // 🧠 META
    terms: {
      type: String,
      trim: true,
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
couponSchema.index({ code: 1, isActive: 1 });
couponSchema.index({ applicableOn: 1, startDate: 1, endDate: 1 });

// 🧠 METHODS

// Check coupon validity
couponSchema.methods.isValid = function (orderAmount = 0) {
  const now = new Date();

  if (!this.isActive) return false;
  if (this.isDeleted) return false;
  if (now < this.startDate || now > this.endDate) return false;
  if (orderAmount < this.minOrderAmount) return false;

  if (this.usageLimit?.total && this.usedCount >= this.usageLimit.total) {
    return false;
  }

  return true;
};

const Coupon = mongoose.model("Coupon", couponSchema);

export default Coupon;
