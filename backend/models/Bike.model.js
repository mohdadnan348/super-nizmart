import mongoose from "mongoose";

const bikeSchema = new mongoose.Schema(
  {
    // 👤 OWNER (company / individual)
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // 🏍️ BASIC INFO
    brand: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    model: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    year: {
      type: Number,
    },

    color: {
      type: String,
      trim: true,
    },

    // 🔢 IDENTIFIERS
    registrationNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    // ⚙️ BIKE TYPE
    bikeType: {
      type: String,
      enum: ["gear", "non-gear", "electric"],
      default: "gear",
      index: true,
    },

    engineCC: {
      type: Number,
      min: 50,
    },

    fuelType: {
      type: String,
      enum: ["petrol", "electric"],
      default: "petrol",
      index: true,
    },

    // 🧾 DOCUMENTS
    documents: {
      rc: {
        number: String,
        expiryDate: Date,
        document: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Document",
        },
      },
      insurance: {
        provider: String,
        policyNumber: String,
        expiryDate: Date,
        document: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Document",
        },
      },
    },

    // 📍 CURRENT LOCATION
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

    // 🟢 AVAILABILITY
    isAvailable: {
      type: Boolean,
      default: true,
      index: true,
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },

    // 🛠️ MAINTENANCE
    maintenance: {
      lastServiceDate: Date,
      nextServiceDue: Date,
      notes: String,
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

    // 📊 STATS
    stats: {
      totalRentals: {
        type: Number,
        default: 0,
      },
      totalDistanceKm: {
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
bikeSchema.index({ currentLocation: "2dsphere" });

// 🔍 INDEXES
bikeSchema.index({ brand: 1, model: 1 });
bikeSchema.index({ isAvailable: 1, isActive: 1 });

// 🧠 METHODS

// Set availability
bikeSchema.methods.setAvailability = function (status) {
  this.isAvailable = status;
  return this.save();
};

const Bike = mongoose.model("Bike", bikeSchema);

export default Bike;
