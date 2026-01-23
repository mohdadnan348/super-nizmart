import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema(
  {
    // 🔗 OWNER / DRIVER
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
      /*
        Usually driver user
      */
    },

    driverProfile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DriverProfile",
      index: true,
    },

    // 🚘 VEHICLE BASIC INFO
    vehicleType: {
      type: String,
      enum: ["bike", "auto", "car", "van"],
      required: true,
      index: true,
    },

    category: {
      type: String,
      enum: [
        "bike",
        "mini",
        "sedan",
        "suv",
        "luxury",
        "electric",
      ],
      index: true,
      /*
        Used for fare calculation
      */
    },

    brand: {
      type: String,
      trim: true,
      index: true,
    },

    model: {
      type: String,
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
      trim: true,
      unique: true,
      index: true,
    },

    // 🧾 DOCUMENTS
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

    fitnessCertificate: {
      expiryDate: Date,
      document: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Document",
      },
    },

    permit: {
      permitType: String, // state / national
      expiryDate: Date,
      document: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Document",
      },
    },

    // 🪑 CAPACITY
    seatingCapacity: {
      type: Number,
      min: 1,
    },

    // ⚡ FUEL TYPE
    fuelType: {
      type: String,
      enum: ["petrol", "diesel", "cng", "electric"],
      index: true,
    },

    // 🟢 STATUS
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },

    isAvailable: {
      type: Boolean,
      default: true,
      index: true,
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
      rejectedReason: String,
    },

    // 📊 STATS
    stats: {
      totalTrips: {
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

// 🔍 INDEXES
vehicleSchema.index({ vehicleType: 1, category: 1 });
vehicleSchema.index({ owner: 1, isActive: 1 });
vehicleSchema.index({ "verification.isVerified": 1 });

// 🧠 METHODS

// Mark vehicle unavailable
vehicleSchema.methods.setAvailability = function (status) {
  this.isAvailable = status;
  return this.save();
};

const Vehicle = mongoose.model("Vehicle", vehicleSchema);

export default Vehicle;
