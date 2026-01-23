import mongoose from "mongoose";

const cinemaSchema = new mongoose.Schema(
  {
    // 👤 OWNER / PARTNER
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // 🎬 BASIC INFO
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

    // 🏢 CINEMA TYPE
    cinemaType: {
      type: String,
      enum: ["single-screen", "multiplex"],
      default: "multiplex",
      index: true,
    },

    // 🏷️ AMENITIES
    amenities: [
      {
        type: String,
        trim: true,
        index: true,
        /*
          Parking, FoodCourt, WheelchairAccess, DolbyAtmos
        */
      },
    ],

    // 🕒 TIMINGS
    openingTime: {
      type: String, // "10:00"
    },

    closingTime: {
      type: String, // "01:00"
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

    // 💰 COMMISSION
    commissionPercentage: {
      type: Number,
      min: 0,
      max: 100,
    },

    // 📊 STATS
    stats: {
      totalShows: {
        type: Number,
        default: 0,
      },
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
cinemaSchema.index({ geoLocation: "2dsphere" });

// 🔍 OTHER INDEXES
cinemaSchema.index({ cinemaType: 1, isActive: 1 });
cinemaSchema.index({ rating: -1 });

// 🧠 METHODS

// Update rating
cinemaSchema.methods.updateRating = function (avg, count) {
  this.rating = avg;
  this.ratingCount = count;
  return this.save();
};

const Cinema = mongoose.model("Cinema", cinemaSchema);

export default Cinema;
