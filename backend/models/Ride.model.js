import mongoose from "mongoose";

const locationSchema = new mongoose.Schema(
  {
    address: {
      type: String,
      trim: true,
    },
    coordinates: {
      type: [Number], // [lng, lat]
      index: "2dsphere",
    },
  },
  { _id: false }
);

const rideSchema = new mongoose.Schema(
  {
    // 👤 RIDER (Customer)
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // 👨‍✈️ DRIVER
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },

    driverProfile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DriverProfile",
      index: true,
    },

    // 🚘 VEHICLE
    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
      index: true,
    },

    // 🚕 RIDE TYPE
    rideType: {
      type: String,
      enum: ["bike", "auto", "car", "van"],
      required: true,
      index: true,
    },

    category: {
      type: String,
      enum: ["bike", "mini", "sedan", "suv", "luxury"],
      index: true,
    },

    // 📍 LOCATIONS
    pickup: {
      type: locationSchema,
      required: true,
    },

    drop: {
      type: locationSchema,
      required: true,
    },

    // 🕒 TIMING
    requestedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },

    acceptedAt: Date,
    startedAt: Date,
    completedAt: Date,

    // 📏 DISTANCE & TIME
    distanceKm: {
      type: Number,
      min: 0,
    },

    durationMinutes: {
      type: Number,
      min: 0,
    },

    // 💰 FARE SNAPSHOT
    fare: {
      baseFare: {
        type: Number,
        min: 0,
      },
      perKmFare: {
        type: Number,
        min: 0,
      },
      perMinuteFare: {
        type: Number,
        min: 0,
      },
      surgeMultiplier: {
        type: Number,
        default: 1,
        min: 1,
      },
      waitingCharge: {
        type: Number,
        default: 0,
      },
      tax: {
        type: Number,
        default: 0,
      },
      discount: {
        type: Number,
        default: 0,
      },
      totalAmount: {
        type: Number,
        required: true,
        min: 0,
      },
      currency: {
        type: String,
        default: "INR",
      },
    },

    // 🏷️ COUPON
    coupon: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Coupon",
    },

    // 💳 PAYMENT
    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
      index: true,
    },

    // 🟢 RIDE STATUS FLOW
    status: {
      type: String,
      enum: [
        "requested",
        "accepted",
        "arrived",
        "in-progress",
        "completed",
        "cancelled",
        "no-show",
      ],
      default: "requested",
      index: true,
    },

    // ❌ CANCELLATION
    cancellation: {
      reason: String,
      cancelledBy: {
        type: String,
        enum: ["user", "driver", "admin"],
      },
      cancelledAt: Date,
      penaltyAmount: Number,
    },

    // ⭐ RATINGS
    rating: {
      userToDriver: {
        rating: Number,
        comment: String,
      },
      driverToUser: {
        rating: Number,
        comment: String,
      },
    },

    // 🧠 META
    notes: {
      type: String,
      trim: true,
    },

    source: {
      type: String,
      enum: ["app", "web", "admin"],
      default: "app",
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

// 🌍 GEO INDEXES
rideSchema.index({ "pickup.coordinates": "2dsphere" });
rideSchema.index({ "drop.coordinates": "2dsphere" });

// 🔍 OTHER INDEXES
rideSchema.index({ driver: 1, status: 1 });
rideSchema.index({ user: 1, createdAt: -1 });

// 🧠 METHODS

// Accept ride
rideSchema.methods.accept = function (driverId, vehicleId) {
  this.driver = driverId;
  this.vehicle = vehicleId;
  this.status = "accepted";
  this.acceptedAt = new Date();
  return this.save();
};

// Start ride
rideSchema.methods.startRide = function () {
  this.status = "in-progress";
  this.startedAt = new Date();
  return this.save();
};

// Complete ride
rideSchema.methods.completeRide = function () {
  this.status = "completed";
  this.completedAt = new Date();
  return this.save();
};

// Cancel ride
rideSchema.methods.cancelRide = function (reason, by) {
  this.status = "cancelled";
  this.cancellation = {
    reason,
    cancelledBy: by,
    cancelledAt: new Date(),
  };
  return this.save();
};

const Ride = mongoose.model("Ride", rideSchema);

export default Ride;
