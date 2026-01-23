import mongoose from "mongoose";

const bikeRentalSchema = new mongoose.Schema(
  {
    // 🔗 BIKE
    bike: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bike",
      required: true,
      index: true,
    },

    // 👤 CUSTOMER
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // 👤 OWNER
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // 🧾 RENTAL META
    rentalNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
      /*
        Example:
        BIKE-2026-000045
      */
    },

    // 🕒 RENTAL PERIOD
    rentalType: {
      type: String,
      enum: ["hourly", "daily"],
      default: "daily",
      index: true,
    },

    startDateTime: {
      type: Date,
      required: true,
      index: true,
    },

    endDateTime: {
      type: Date,
      required: true,
      index: true,
    },

    durationHours: {
      type: Number,
      min: 1,
    },

    durationDays: {
      type: Number,
      min: 1,
    },

    // 📍 PICKUP / DROP
    pickupLocation: {
      address: String,
      coordinates: {
        type: [Number], // [lng, lat]
      },
    },

    dropLocation: {
      address: String,
      coordinates: {
        type: [Number],
      },
    },

    // 💰 PRICING SNAPSHOT
    pricing: {
      rate: {
        type: Number,
        required: true,
        min: 0,
      },
      securityDeposit: {
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
      lateFeePerHour: {
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

    // 🟢 RENTAL STATUS
    status: {
      type: String,
      enum: [
        "reserved",
        "active",
        "completed",
        "cancelled",
        "late",
      ],
      default: "reserved",
      index: true,
    },

    // 🕓 ACTUAL RETURN
    actualReturnAt: Date,

    lateFeeApplied: {
      type: Number,
      default: 0,
    },

    // ❌ CANCELLATION
    cancellation: {
      reason: String,
      cancelledAt: Date,
      cancelledBy: {
        type: String,
        enum: ["user", "owner", "admin"],
      },
      refundableAmount: Number,
    },

    // ⭐ RATING
    rating: {
      userRating: {
        rating: Number,
        comment: String,
      },
      ownerRating: {
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

// 🔍 INDEXES
bikeRentalSchema.index({
  bike: 1,
  startDateTime: 1,
  endDateTime: 1,
});
bikeRentalSchema.index({ user: 1, createdAt: -1 });
bikeRentalSchema.index({ status: 1, paymentStatus: 1 });

// 🧠 METHODS

// Activate rental
bikeRentalSchema.methods.startRental = function () {
  this.status = "active";
  return this.save();
};

// Complete rental
bikeRentalSchema.methods.completeRental = function () {
  this.status = "completed";
  this.actualReturnAt = new Date();
  return this.save();
};

// Cancel rental
bikeRentalSchema.methods.cancelRental = function (reason, by) {
  this.status = "cancelled";
  this.cancellation = {
    reason,
    cancelledAt: new Date(),
    cancelledBy: by,
  };
  return this.save();
};

const BikeRental = mongoose.model(
  "BikeRental",
  bikeRentalSchema
);

export default BikeRental;
