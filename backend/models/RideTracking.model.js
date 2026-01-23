import mongoose from "mongoose";

const locationPingSchema = new mongoose.Schema(
  {
    coordinates: {
      type: [Number], // [lng, lat]
      required: true,
    },

    speedKmph: {
      type: Number,
      min: 0,
    },

    heading: {
      type: Number, // direction in degrees
      min: 0,
      max: 360,
    },

    accuracyMeters: {
      type: Number,
      min: 0,
    },

    recordedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  { _id: false }
);

const rideTrackingSchema = new mongoose.Schema(
  {
    // 🔗 RIDE
    ride: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ride",
      required: true,
      unique: true,
      index: true,
    },

    // 👨‍✈️ DRIVER
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    driverProfile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DriverProfile",
    },

    // 🚘 VEHICLE
    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
    },

    // 📍 CURRENT LOCATION (latest ping)
    currentLocation: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [lng, lat]
      },
      updatedAt: {
        type: Date,
      },
    },

    // 🗺️ ROUTE HISTORY
    route: {
      type: [locationPingSchema],
      default: [],
    },

    // 📏 METRICS
    stats: {
      totalDistanceKm: {
        type: Number,
        default: 0,
      },
      averageSpeedKmph: {
        type: Number,
        default: 0,
      },
      maxSpeedKmph: {
        type: Number,
        default: 0,
      },
    },

    // 🟢 TRACKING STATUS
    status: {
      type: String,
      enum: ["active", "paused", "completed"],
      default: "active",
      index: true,
    },

    // 🚨 SAFETY FLAGS
    alerts: {
      overspeeding: {
        type: Boolean,
        default: false,
      },
      routeDeviation: {
        type: Boolean,
        default: false,
      },
      sosTriggered: {
        type: Boolean,
        default: false,
      },
    },

    // 🧠 META
    lastPingAt: {
      type: Date,
      index: true,
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
rideTrackingSchema.index({ currentLocation: "2dsphere" });
rideTrackingSchema.index({ "route.coordinates": "2dsphere" });

// 🔍 OTHER INDEXES
rideTrackingSchema.index({ driver: 1, status: 1 });
rideTrackingSchema.index({ ride: 1, status: 1 });

// 🧠 METHODS

// Add GPS ping
rideTrackingSchema.methods.addPing = function (ping) {
  this.route.push(ping);
  this.currentLocation = {
    type: "Point",
    coordinates: ping.coordinates,
    updatedAt: new Date(),
  };
  this.lastPingAt = new Date();

  // speed stats
  if (ping.speedKmph) {
    this.stats.maxSpeedKmph = Math.max(
      this.stats.maxSpeedKmph,
      ping.speedKmph
    );
  }

  return this.save();
};

// Complete tracking
rideTrackingSchema.methods.completeTracking = function () {
  this.status = "completed";
  return this.save();
};

const RideTracking = mongoose.model(
  "RideTracking",
  rideTrackingSchema
);

export default RideTracking;
