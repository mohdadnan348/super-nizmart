import mongoose from "mongoose";

const restaurantSchema = new mongoose.Schema(
  {
    // 👤 OWNER
    owner: {
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

    // 📍 LOCATION
    address: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
      required: true,
    },

    geoLocation: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [lng, lat]
      },
    },

    // 🍽️ RESTAURANT TYPE
    restaurantType: {
      type: String,
      enum: [
        "dine-in",
        "delivery",
        "takeaway",
        "cloud-kitchen",
      ],
      default: "delivery",
      index: true,
    },

    cuisines: [
      {
        type: String,
        trim: true,
        index: true,
      },
    ],

    // ⏰ OPENING HOURS
    timing: {
      openingTime: {
        type: String, // "10:00"
        required: true,
      },
      closingTime: {
        type: String, // "23:00"
        required: true,
      },
      is24x7: {
        type: Boolean,
        default: false,
      },
      weeklyOff: [String], // ["Monday"]
    },

    // 🚚 DELIVERY SETTINGS
    delivery: {
      isAvailable: {
        type: Boolean,
        default: true,
        index: true,
      },
      radiusKm: {
        type: Number,
        default: 5,
      },
      minOrderAmount: {
        type: Number,
        default: 0,
      },
      deliveryCharge: {
        type: Number,
        default: 0,
      },
    },

    // 🪑 DINE-IN
    dineIn: {
      isAvailable: {
        type: Boolean,
        default: false,
      },
      seatingCapacity: {
        type: Number,
      },
    },

    // 🖼️ MEDIA
    logo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Document",
    },

    images: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Document",
      },
    ],

    // ⭐ RATINGS
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

    // 🟢 STATUS / APPROVAL
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

    // 🧾 COMMISSION (override)
    commissionPercentage: {
      type: Number,
      min: 0,
      max: 100,
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

// 🌍 GEO INDEX
restaurantSchema.index({ geoLocation: "2dsphere" });

// 🔍 OTHER INDEXES
restaurantSchema.index({ cuisines: 1, isActive: 1 });
restaurantSchema.index({ restaurantType: 1 });

// 🧠 METHODS

// Update rating cache
restaurantSchema.methods.updateRating = function (avg, count) {
  this.rating = avg;
  this.ratingCount = count;
  return this.save();
};

const Restaurant = mongoose.model("Restaurant", restaurantSchema);

export default Restaurant;
