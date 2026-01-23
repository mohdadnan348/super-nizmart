import mongoose from "mongoose";

const propertySchema = new mongoose.Schema(
  {
    // 👤 OWNER / BROKER
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // 🏷️ BASIC INFO
    title: {
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

    // 🏠 PROPERTY TYPE
    propertyType: {
      type: String,
      enum: [
        "apartment",
        "independent-house",
        "villa",
        "plot",
        "commercial",
        "office",
        "shop",
      ],
      required: true,
      index: true,
    },

    listingType: {
      type: String,
      enum: ["rent", "sale"],
      required: true,
      index: true,
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

    // 📐 AREA DETAILS
    area: {
      carpetArea: Number,
      builtUpArea: Number,
      superBuiltUpArea: Number,
      unit: {
        type: String,
        enum: ["sqft", "sqm"],
        default: "sqft",
      },
    },

    // 🏗️ PROPERTY DETAILS
    bedrooms: {
      type: Number,
      min: 0,
      index: true,
    },

    bathrooms: {
      type: Number,
      min: 0,
    },

    balconies: {
      type: Number,
      min: 0,
    },

    furnishing: {
      type: String,
      enum: ["unfurnished", "semi-furnished", "fully-furnished"],
      index: true,
    },

    floor: {
      number: Number,
      totalFloors: Number,
    },

    facing: {
      type: String,
      enum: ["north", "south", "east", "west", "north-east", "north-west", "south-east", "south-west"],
    },

    // 🅿️ PARKING
    parking: {
      covered: {
        type: Number,
        default: 0,
      },
      open: {
        type: Number,
        default: 0,
      },
    },

    // 🏷️ AMENITIES
    amenities: [
      {
        type: String,
        trim: true,
        index: true,
        /*
          Lift, PowerBackup, Gym, SwimmingPool, Security
        */
      },
    ],

    // 💰 PRICING
    pricing: {
      price: {
        type: Number,
        min: 0,
        index: true,
      },
      rent: {
        type: Number,
        min: 0,
        index: true,
      },
      maintenance: {
        type: Number,
        default: 0,
      },
      securityDeposit: {
        type: Number,
        default: 0,
      },
      negotiable: {
        type: Boolean,
        default: false,
      },
      currency: {
        type: String,
        default: "INR",
      },
    },

    // 📅 AVAILABILITY
    availability: {
      availableFrom: {
        type: Date,
        index: true,
      },
      possessionStatus: {
        type: String,
        enum: ["ready", "under-construction"],
        index: true,
      },
    },

    // 🖼️ MEDIA
    images: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Document",
      },
    ],

    documents: [
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
      visits: {
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
propertySchema.index({ geoLocation: "2dsphere" });

// 🔍 OTHER INDEXES
propertySchema.index({ propertyType: 1, listingType: 1 });
propertySchema.index({ "pricing.price": 1 });
propertySchema.index({ "pricing.rent": 1 });
propertySchema.index({ bedrooms: 1, furnishing: 1 });

// 🧠 METHODS

// Increment views
propertySchema.methods.incrementViews = function () {
  this.stats.views += 1;
  return this.save();
};

const Property = mongoose.model("Property", propertySchema);

export default Property;
