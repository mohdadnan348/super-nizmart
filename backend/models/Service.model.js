import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
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

    // 🔗 CATEGORY (Urban-style hierarchy)
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ServiceCategory",
      required: true,
      index: true,
    },

    // 👤 SERVICE PROVIDER (seller / professional)
    provider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // 🧩 SERVICE TYPE (analytics / filtering)
    serviceType: {
      type: String,
      enum: [
        "home-service",
        "professional",
        "health",
        "legal",
        "repair",
        "cleaning",
        "beauty",
        "other",
      ],
      index: true,
    },

    // 💰 PRICING
    pricing: {
      priceType: {
        type: String,
        enum: ["fixed", "starting-from", "hourly", "per-unit"],
        default: "fixed",
      },

      basePrice: {
        type: Number,
        required: true,
        min: 0,
      },

      maxPrice: {
        type: Number,
        min: 0,
      },

      currency: {
        type: String,
        default: "INR",
      },

      taxIncluded: {
        type: Boolean,
        default: true,
      },
    },

    // ⏱️ DURATION
    duration: {
      value: {
        type: Number, // e.g. 60
        required: true,
      },
      unit: {
        type: String,
        enum: ["minutes", "hours", "days"],
        default: "minutes",
      },
    },

    // 📍 SERVICE LOCATION
    serviceLocation: {
      type: String,
      enum: ["at-home", "at-center", "online"],
      default: "at-home",
      index: true,
    },

    // 🌍 COVERAGE (for providers)
    serviceArea: {
      cities: [String],
      pincodes: [String],
    },

    // 🖼️ MEDIA
    images: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Document",
      },
    ],

    // ⭐ RATINGS (cached for performance)
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

    // 📦 SERVICE OPTIONS / VARIANTS
    options: [
      {
        name: {
          type: String,
          trim: true,
        },
        price: {
          type: Number,
          min: 0,
        },
        duration: {
          type: Number, // minutes
        },
      },
    ],

    // 🟢 VISIBILITY / STATUS
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

    // 🧠 BOOKING SETTINGS
    bookingSettings: {
      instantBooking: {
        type: Boolean,
        default: true,
      },
      cancellationAllowed: {
        type: Boolean,
        default: true,
      },
      cancellationWindowHours: {
        type: Number,
        default: 24,
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
serviceSchema.index({ category: 1, isActive: 1 });
serviceSchema.index({ provider: 1, isApproved: 1 });
serviceSchema.index({ serviceType: 1, rating: -1 });

// 🧠 METHODS

// Update rating cache
serviceSchema.methods.updateRating = function (avgRating, count) {
  this.rating = avgRating;
  this.ratingCount = count;
  return this.save();
};

const Service = mongoose.model("Service", serviceSchema);

export default Service;
