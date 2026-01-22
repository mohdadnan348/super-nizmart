import mongoose from "mongoose";

const quotationSchema = new mongoose.Schema(
  {
    // 🔗 RFQ LINK
    rfq: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RFQ",
      required: true,
      index: true,
    },

    // 👤 SELLER
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // 🔗 SELLER BUSINESS PROFILE
    businessProfile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BusinessProfile",
      required: true,
      index: true,
    },

    // 👤 BUYER (fast access)
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // 💰 QUOTATION PRICING
    pricing: {
      pricePerUnit: {
        type: Number,
        required: true,
        min: 0,
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
      },
      subTotal: {
        type: Number,
        required: true,
        min: 0,
      },
      taxPercentage: {
        type: Number,
        min: 0,
        max: 28,
        default: 0,
      },
      taxAmount: {
        type: Number,
        default: 0,
      },
      totalAmount: {
        type: Number,
        required: true,
        min: 0,
      },
      currency: {
        type: String,
        default: "INR",
      },
    },

    // 📦 DELIVERY TERMS
    delivery: {
      timelineValue: {
        type: Number,
      },
      timelineUnit: {
        type: String,
        enum: ["days", "weeks"],
        default: "days",
      },
      location: {
        city: String,
        state: String,
        country: {
          type: String,
          default: "India",
        },
      },
    },

    // 🧾 TERMS & CONDITIONS
    terms: {
      paymentTerms: {
        type: String, // Advance / Credit etc.
        trim: true,
      },
      validityDays: {
        type: Number,
        default: 7,
      },
      notes: {
        type: String,
        trim: true,
      },
    },

    validTill: {
      type: Date,
      index: true,
    },

    // 💬 NEGOTIATION (message thread)
    messages: [
      {
        sender: {
          type: String,
          enum: ["buyer", "seller"],
          required: true,
        },
        message: {
          type: String,
          trim: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    // 🟢 STATUS FLOW
    status: {
      type: String,
      enum: [
        "sent",
        "viewed",
        "negotiation",
        "accepted",
        "rejected",
        "expired",
      ],
      default: "sent",
      index: true,
    },

    respondedAt: {
      type: Date,
    },

    // 🧑‍💼 ADMIN / SYSTEM
    createdBy: {
      type: String,
      enum: ["seller", "admin"],
      default: "seller",
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
quotationSchema.index({ rfq: 1, seller: 1 }, { unique: true });
quotationSchema.index({ buyer: 1, createdAt: -1 });
quotationSchema.index({ seller: 1, status: 1 });

// 🧠 METHODS

// Accept quotation
quotationSchema.methods.accept = function () {
  this.status = "accepted";
  this.respondedAt = new Date();
  return this.save();
};

// Reject quotation
quotationSchema.methods.reject = function () {
  this.status = "rejected";
  this.respondedAt = new Date();
  return this.save();
};

const Quotation = mongoose.model("Quotation", quotationSchema);

export default Quotation;
