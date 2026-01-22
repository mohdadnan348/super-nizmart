import mongoose from "mongoose";

const tradeLeadSchema = new mongoose.Schema(
  {
    // 👤 BUYER (lead raise karne wala)
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // 🔗 BUYER BUSINESS (optional)
    buyerBusinessProfile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BusinessProfile",
      index: true,
    },

    // 🏷️ LEAD BASIC INFO
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

    // 📦 REQUIREMENT
    quantity: {
      value: {
        type: Number,
        required: true,
        min: 1,
      },
      unit: {
        type: String,
        default: "pcs",
      },
    },

    expectedPrice: {
      min: Number,
      max: Number,
      currency: {
        type: String,
        default: "INR",
      },
    },

    // 📍 DELIVERY LOCATION
    deliveryLocation: {
      city: String,
      state: String,
      country: {
        type: String,
        default: "India",
      },
      pincode: String,
    },

    // 📎 ATTACHMENTS
    attachments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Document",
      },
    ],

    // 👥 INTERESTED SELLERS
    interestedSellers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        index: true,
      },
    ],

    // 🟢 LEAD VISIBILITY
    isPublic: {
      type: Boolean,
      default: true,
      index: true,
    },

    // 🟢 STATUS
    status: {
      type: String,
      enum: ["open", "contacted", "closed", "expired"],
      default: "open",
      index: true,
    },

    expiresAt: {
      type: Date,
      index: true,
    },

    // 💰 PAID LEAD (monetization)
    isPaidLead: {
      type: Boolean,
      default: false,
      index: true,
    },

    leadPrice: {
      type: Number, // amount seller pays to unlock contact
      min: 0,
    },

    // 📊 STATS
    stats: {
      views: {
        type: Number,
        default: 0,
      },
      contactsUnlocked: {
        type: Number,
        default: 0,
      },
    },

    // 🧑‍💼 SYSTEM
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
tradeLeadSchema.index({ category: 1, status: 1 });
tradeLeadSchema.index({ buyer: 1, createdAt: -1 });
tradeLeadSchema.index({ isPaidLead: 1, status: 1 });

// 🧠 METHODS

// Increment views
tradeLeadSchema.methods.incrementViews = function () {
  this.stats.views += 1;
  return this.save();
};

// Unlock lead contact (paid lead)
tradeLeadSchema.methods.unlockForSeller = function (sellerId) {
  if (!this.interestedSellers.includes(sellerId)) {
    this.interestedSellers.push(sellerId);
    this.stats.contactsUnlocked += 1;
  }
  return this.save();
};

const TradeLead = mongoose.model("TradeLead", tradeLeadSchema);

export default TradeLead;
