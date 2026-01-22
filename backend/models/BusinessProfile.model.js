import mongoose from "mongoose";

const businessProfileSchema = new mongoose.Schema(
  {
    // 🔗 OWNER (B2B SELLER)
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },

    // 🏢 BUSINESS BASIC INFO
    businessName: {
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

    businessType: {
      type: String,
      enum: [
        "manufacturer",
        "wholesaler",
        "trader",
        "exporter",
        "importer",
        "service-provider",
      ],
      required: true,
      index: true,
    },

    yearEstablished: {
      type: Number,
    },

    description: {
      type: String,
      trim: true,
    },

    // 🏷️ INDUSTRY / CATEGORY
    categories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ServiceCategory",
        index: true,
      },
    ],

    // 📍 BUSINESS ADDRESS
    address: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
      required: true,
    },

    // 📞 CONTACT DETAILS
    contact: {
      contactPerson: {
        type: String,
        trim: true,
      },
      phone: {
        type: String,
        trim: true,
      },
      email: {
        type: String,
        trim: true,
        lowercase: true,
      },
      website: {
        type: String,
        trim: true,
      },
    },

    // 🌍 BUSINESS REACH
    businessReach: {
      domestic: {
        type: Boolean,
        default: true,
      },
      international: {
        type: Boolean,
        default: false,
      },
      countries: [String],
    },

    // 🏭 CAPACITY / SCALE
    scale: {
      employees: {
        type: Number,
        min: 1,
      },
      annualTurnover: {
        type: String, // range based
      },
      productionCapacity: {
        type: String,
      },
    },

    // 🧾 TAX & REGISTRATION
    registration: {
      gstin: {
        type: String,
        trim: true,
        index: true,
      },
      pan: {
        type: String,
        trim: true,
      },
      iec: {
        type: String, // import export code
        trim: true,
      },
    },

    // 🖼️ MEDIA
    logo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Document",
    },

    gallery: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Document",
      },
    ],

    certificates: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Document",
      },
    ],

    // ⭐ TRUST & RATINGS
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

    // 🟢 VERIFICATION
    verification: {
      isVerified: {
        type: Boolean,
        default: false,
        index: true,
      },
      verifiedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      verifiedAt: {
        type: Date,
      },
      rejectedReason: {
        type: String,
        trim: true,
      },
    },

    // 🔥 B2B FEATURES
    features: {
      isPremium: {
        type: Boolean,
        default: false,
        index: true,
      },
      priorityListing: {
        type: Boolean,
        default: false,
      },
      leadLimitPerMonth: {
        type: Number,
      },
    },

    // 📊 STATS (analytics)
    stats: {
      totalProducts: {
        type: Number,
        default: 0,
      },
      totalLeads: {
        type: Number,
        default: 0,
      },
      totalRFQs: {
        type: Number,
        default: 0,
      },
    },

    // 🟢 STATUS
    isActive: {
      type: Boolean,
      default: true,
      index: true,
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
businessProfileSchema.index({ businessName: 1, isActive: 1 });
businessProfileSchema.index({ businessType: 1 });
businessProfileSchema.index({ "verification.isVerified": 1 });

// 🧠 METHODS

// Update rating cache
businessProfileSchema.methods.updateRating = function (avg, count) {
  this.rating = avg;
  this.ratingCount = count;
  return this.save();
};

const BusinessProfile = mongoose.model(
  "BusinessProfile",
  businessProfileSchema
);

export default BusinessProfile;
