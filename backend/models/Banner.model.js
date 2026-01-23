import mongoose from "mongoose";

const bannerSchema = new mongoose.Schema(
  {
    // 🏷️ BASIC INFO
    title: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    subtitle: {
      type: String,
      trim: true,
    },

    // 🖼️ MEDIA
    image: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Document",
      required: true,
    },

    mobileImage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Document",
      /*
        Optional: different image for mobile
      */
    },

    // 🔗 CTA / REDIRECT
    linkType: {
      type: String,
      enum: ["external", "internal"],
      default: "internal",
      index: true,
    },

    redirectUrl: {
      type: String,
      trim: true,
    },

    // 🎯 TARGETING
    targetModule: {
      type: String,
      enum: [
        "home",
        "service",
        "product",
        "restaurant",
        "hotel",
        "cinema",
        "property",
        "ride",
        "custom",
      ],
      default: "home",
      index: true,
    },

    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      /*
        serviceId / productId / hotelId / movieId etc.
      */
      index: true,
    },

    // 📍 PLACEMENT
    position: {
      type: String,
      enum: ["top", "middle", "bottom", "popup"],
      default: "top",
      index: true,
    },

    // 🕒 SCHEDULING
    schedule: {
      startAt: {
        type: Date,
        index: true,
      },
      endAt: {
        type: Date,
        index: true,
      },
    },

    // 🔢 PRIORITY (higher = shown first)
    priority: {
      type: Number,
      default: 1,
      index: true,
    },

    // 📊 STATS
    stats: {
      impressions: {
        type: Number,
        default: 0,
      },
      clicks: {
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

    isFeatured: {
      type: Boolean,
      default: false,
      index: true,
    },

    // 👤 CREATED BY (ADMIN)
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },

    // 🧠 META
    notes: {
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
bannerSchema.index({ targetModule: 1, isActive: 1 });
bannerSchema.index({ priority: -1 });
bannerSchema.index({ "schedule.startAt": 1, "schedule.endAt": 1 });

// 🧠 METHODS

// Increment impression
bannerSchema.methods.incrementImpression = function () {
  this.stats.impressions += 1;
  return this.save();
};

// Increment click
bannerSchema.methods.incrementClick = function () {
  this.stats.clicks += 1;
  return this.save();
};

const Banner = mongoose.model("Banner", bannerSchema);

export default Banner;
