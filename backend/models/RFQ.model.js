import mongoose from "mongoose";

const rfqSchema = new mongoose.Schema(
  {
    // 👤 BUYER (RFQ raise karne wala)
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // 🔗 BUYER BUSINESS (optional – B2B buyer)
    buyerBusinessProfile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BusinessProfile",
      index: true,
    },

    // 🏷️ RFQ BASIC INFO
    title: {
      type: String,
      required: true,
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

    // 🔗 RELATED BULK PRODUCT (optional)
    bulkProduct: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BulkProduct",
      index: true,
    },

    // 📦 REQUIREMENT DETAILS
    quantity: {
      value: {
        type: Number,
        required: true,
        min: 1,
      },
      unit: {
        type: String, // pcs / kg / ton
        default: "pcs",
      },
    },

    expectedPrice: {
      min: {
        type: Number,
        min: 0,
      },
      max: {
        type: Number,
        min: 0,
      },
      currency: {
        type: String,
        default: "INR",
      },
    },

    // 📍 DELIVERY DETAILS
    deliveryLocation: {
      city: String,
      state: String,
      country: {
        type: String,
        default: "India",
      },
      pincode: String,
    },

    deliveryTimeline: {
      value: Number,
      unit: {
        type: String,
        enum: ["days", "weeks"],
        default: "days",
      },
    },

    // 📎 ATTACHMENTS (specs, drawings)
    attachments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Document",
      },
    ],

    // 👥 TARGET SELLERS (optional – direct RFQ)
    targetSellers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        index: true,
      },
    ],

    // 🟢 VISIBILITY
    isPublic: {
      type: Boolean,
      default: true,
      index: true,
    },

    // 🟢 STATUS FLOW
    status: {
      type: String,
      enum: [
        "open",
        "quoted",
        "negotiation",
        "closed",
        "expired",
      ],
      default: "open",
      index: true,
    },

    expiresAt: {
      type: Date,
      index: true,
    },

    // 📊 STATS
    stats: {
      views: {
        type: Number,
        default: 0,
      },
      quotationsReceived: {
        type: Number,
        default: 0,
      },
    },

    // 🧑‍💼 ADMIN / SYSTEM
    createdBy: {
      type: String,
      enum: ["buyer", "admin"],
      default: "buyer",
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
rfqSchema.index({ category: 1, status: 1 });
rfqSchema.index({ buyer: 1, createdAt: -1 });
rfqSchema.index({ isPublic: 1, status: 1 });

// 🧠 METHODS

// Increment view count
rfqSchema.methods.incrementViews = function () {
  this.stats.views += 1;
  return this.save();
};

// Mark RFQ closed
rfqSchema.methods.closeRFQ = function () {
  this.status = "closed";
  return this.save();
};

const RFQ = mongoose.model("RFQ", rfqSchema);

export default RFQ;
