import mongoose from "mongoose";

const guestSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      trim: true,
    },
    age: Number,
    idProofType: String,
    idProofNumber: String,
  },
  { _id: false }
);

const roomBookingSchema = new mongoose.Schema(
  {
    // 🔗 HOTEL & ROOM
    hotel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",
      required: true,
      index: true,
    },

    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true,
      index: true,
    },

    // 👤 GUEST / USER
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // 🧾 BOOKING META
    bookingNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
      /*
        Example:
        HTL-2026-000123
      */
    },

    // 📅 STAY DATES
    checkInDate: {
      type: Date,
      required: true,
      index: true,
    },

    checkOutDate: {
      type: Date,
      required: true,
      index: true,
    },

    nights: {
      type: Number,
      required: true,
      min: 1,
    },

    // 👥 GUEST COUNT
    guests: {
      adults: {
        type: Number,
        required: true,
        min: 1,
      },
      children: {
        type: Number,
        default: 0,
      },
      total: {
        type: Number,
        required: true,
      },
    },

    guestDetails: [guestSchema],

    // 🛏️ ROOM COUNT
    roomsBooked: {
      type: Number,
      default: 1,
      min: 1,
    },

    // 💰 PRICING SNAPSHOT
    pricing: {
      pricePerNight: {
        type: Number,
        required: true,
        min: 0,
      },
      taxes: {
        type: Number,
        default: 0,
      },
      discount: {
        type: Number,
        default: 0,
      },
      extraBedCharge: {
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

    // 🟢 BOOKING STATUS
    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "checked-in",
        "completed",
        "cancelled",
        "no-show",
      ],
      default: "pending",
      index: true,
    },

    // ⏱️ CHECK-IN / CHECK-OUT
    checkedInAt: Date,
    checkedOutAt: Date,

    // ❌ CANCELLATION
    cancellation: {
      reason: String,
      cancelledAt: Date,
      cancelledBy: {
        type: String,
        enum: ["user", "hotel", "admin"],
      },
      refundableAmount: Number,
    },

    // 🧠 META
    specialRequest: {
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
roomBookingSchema.index({
  room: 1,
  checkInDate: 1,
  checkOutDate: 1,
});
roomBookingSchema.index({ user: 1, createdAt: -1 });
roomBookingSchema.index({ hotel: 1, status: 1 });

// 🧠 METHODS

// Confirm booking
roomBookingSchema.methods.confirm = function () {
  this.status = "confirmed";
  return this.save();
};

// Cancel booking
roomBookingSchema.methods.cancel = function (reason, by) {
  this.status = "cancelled";
  this.cancellation = {
    reason,
    cancelledAt: new Date(),
    cancelledBy: by,
  };
  return this.save();
};

const RoomBooking = mongoose.model(
  "RoomBooking",
  roomBookingSchema
);

export default RoomBooking;
