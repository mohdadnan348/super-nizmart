import mongoose from "mongoose";

const bulkProductSchema = new mongoose.Schema(
  {
    // 🔗 BUSINESS PROFILE (B2B Seller)
    businessProfile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BusinessProfile",
      required: true,
      index: true,
    },

    // 👤 SELLER (redundant for fast queries)
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // 🏷️ BASIC INFO
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    slug: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    description: {
      type: String,
      trim: true,
    },

    // 🗂️ CATEGORY / INDUSTRY
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ServiceCategory",
      required: true,
      index: true,
    },

    // 📐 SPECIFICATIONS (B2B focus)
    specifications: [
      {
        key: {
          type: String,
          trim: true,
        },
        value: {
          type: String,
          trim: true,
        },
      },
    ],

    // 📦 MOQ & PRICING
    moq: {
      type: Number, // Minimum Order Quantity
      required: true,
      min: 1,
      index: true,
    },

    pricingType: {
      type: String,
      enum: ["fixed", "range", "negotiable"],
      default: "negotiable",
      index: true,
    },

    price: {
      type: Number, // fixed price
      min: 0,
    },

    priceRange: {
      min: {
        type: Number,
        min: 0,
      },
      max: {
        type: Number,
        min: 0,
      },
    },

    currency: {
      type: String,
      default: "INR",
    },

    // 🧾 TAX / HSN
    tax: {
      hsn: {
        type: String,
        trim: true,
      },
      gstPercentage: {
        type: Number,
        min: 0,
        max: 28,
      },
    },

    // 🖼️ MEDIA
    images: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Document",
      },
    ],

    // 🚚 SUPPLY & LOGISTICS
    supplyAbility: {
      quantity: Number, // per month
      unit: String,     // pcs / kg / ton
    },

    deliveryTime: {
      value: Number,
      unit: {
        type: String,
        enum: ["days", "weeks"],
        default: "days",
      },
    },

    // 🌍 EXPORT DETAILS
    exportDetails: {
      isExportable: {
        type: Boolean,
        default: false,
      },
      ports: [String],
      countries: [String],
    },

    // ⭐ TRUST SIGNALS
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    ratingCount: {
      type: Number,
      default: 0,
    },

    // 🟢 VISIBILITY / APPROVAL
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },

    isApproved: {
      type: Boolean,
      default: false,
      index: true,
    },

    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    approvedAt: {
      type: Date,
    },

    isFeatured: {
      type: Boolean,
      default: false,
      index: true,
    },

    // 📊 STATS
    stats: {
      views: {
        type: Number,
        default: 0,
      },
      inquiries: {
        type: Number,
        default: 0,
      },
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
bulkProductSchema.index({ category: 1, isApproved: 1 });
bulkProductSchema.index({ moq: 1, pricingType: 1 });
bulkProductSchema.index({ seller: 1, isActive: 1 });

// 🧠 METHODS

// Increment inquiry count
bulkProductSchema.methods.incrementInquiry = function () {
  this.stats.inquiries += 1;
  return this.save();
};

const BulkProduct = mongoose.model(
  "BulkProduct",
  bulkProductSchema
);

export default BulkProduct;
