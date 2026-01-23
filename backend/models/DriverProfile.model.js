import mongoose from "mongoose";

const driverProfileSchema = new mongoose.Schema(
  {
    // 🔗 USER (Driver)
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },

    // 🚗 BASIC INFO
    fullName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    phone: {
      type: String,
      trim: true,
      index: true,
    },

    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },

    experienceYears: {
      type: Number,
      min: 0,
    },

    about: {
      type: String,
      trim: true,
    },

    // 🪪 LICENSE DETAILS
    license: {
      number: {
        type: String,
        required: true,
        trim: true,
        index: true,
      },
      issuingAuthority: String,
      expiryDate: Date,
      document: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Document",
      },
    },

    // 🧾 KYC DOCUMENTS
    documents: {
      aadhar: {
        number: String,
        document: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Document",
        },
      },
      pan: {
        number: String,
        document: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Document",
        },
      },
      policeVerification: {
        document: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Document",
        },
        verifiedAt: Date,
      },
    },

    // 🕒 AVAILABILITY
    availability: {
      isOnline: {
        type: Boolean,
        default: false,
        index: true,
      },
      shift: {
        type: String,
        enum: ["day", "night", "flexible"],
        default: "flexible",
      },
    },

    // 📍 CURRENT LOCATION (for live tracking)
    currentLocation: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [lng, lat]
      },
    },

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
      verifiedAt: Date,
      rejectedReason: {
        type: String,
        trim: true,
      },
    },

    // 🟢 STATUS
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },

    isBlocked: {
      type: Boolean,
      default: false,
      index: true,
    },

    // 📊 STATS
    stats: {
      totalRides: {
        type: Number,
        default: 0,
      },
      totalDistanceKm: {
        type: Number,
        default: 0,
      },
      totalEarnings: {
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
driverProfileSchema.index({ currentLocation: "2dsphere" });

// 🔍 INDEXES
driverProfileSchema.index({ "availability.isOnline": 1 });
driverProfileSchema.index({ "verification.isVerified": 1 });

// 🧠 METHODS

// Update rating cache
driverProfileSchema.methods.updateRating = function (avg, count) {
  this.rating = avg;
  this.ratingCount = count;
  return this.save();
};

// Go online/offline
driverProfileSchema.methods.setOnline = function (status) {
  this.availability.isOnline = status;
  return this.save();
};

const DriverProfile = mongoose.model(
  "DriverProfile",
  driverProfileSchema
);

export default DriverProfile;
