import mongoose from "mongoose";

const hotelSchema = new mongoose.Schema(
  {
    // 👤 OWNER / MANAGER
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // 🏨 BASIC INFO
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

    // 🏷️ HOTEL TYPE
    hotelType: {
      type: String,
      enum: ["hotel", "resort", "homestay", "hostel", "guest-house"],
      default: "hotel",
      index: true,
    },

    starRating: {
      type: Number, // 1–5
      min: 1,
      max: 5,
      index: true,
    },

    // 🏷️ AMENITIES
    amenities: [
      {
        type: String,
        trim: true,
        index: true,
        /*
          Examples:
          Wifi, Parking, AC, Pool, Breakfast, Gym
        */
      },
    ],

    // 🕒 CHECK-IN / CHECK-OUT
    timing: {
      checkIn: {
        type: String, // "12:00"
        required: true,
      },
      checkOut: {
        type: String, // "11:00"
        required: true,
      },
      is24x7: {
        type: Boolean,
        default: false,
      },
    },

    // 🧾 POLICIES
    policies: {
      cancellation: {
        type: String,
        trim: true,
      },
      childPolicy: {
        type: String,
        trim: true,
      },
      petPolicy: {
        type: String,
        trim: true,
      },
      idProofRequired: {
        type: Boolean,
        default: true,
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

    // 🧾 COMMISSION
    commissionPercentage: {
      type: Number,
      min: 0,
      max: 100,
    },

    // 📊 STATS
    stats: {
      totalBookings: {
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

// 🌍 GEO INDEX
hotelSchema.index({ geoLocation: "2dsphere" });

// 🔍 OTHER INDEXES
hotelSchema.index({ hotelType: 1, isActive: 1 });
hotelSchema.index({ starRating: 1 });

// 🧠 METHODS

// Update rating cache
hotelSchema.methods.updateRating = function (avg, count) {
  this.rating = avg;
  this.ratingCount = count;
  return this.save();
};

const Hotel = mongoose.model("Hotel", hotelSchema);

export default Hotel;
