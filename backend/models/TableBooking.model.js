import mongoose from "mongoose";

const tableBookingSchema = new mongoose.Schema(
  {
    // 🔗 RESTAURANT
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
      index: true,
    },

    // 🪑 TABLE
    table: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Table",
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

    // 👥 GUEST INFO
    guests: {
      count: {
        type: Number,
        required: true,
        min: 1,
      },
      adults: {
        type: Number,
        min: 1,
      },
      children: {
        type: Number,
        default: 0,
      },
    },

    // 🕒 BOOKING SLOT
    bookingDate: {
      type: Date,
      required: true,
      index: true,
    },

    startTime: {
      type: String, // "19:00"
      required: true,
    },

    endTime: {
      type: String, // "21:00"
      required: true,
    },

    durationMinutes: {
      type: Number,
      default: 120,
    },

    // 📞 CONTACT INFO
    contact: {
      name: {
        type: String,
        trim: true,
      },
      phone: {
        type: String,
        trim: true,
      },
      email: {
        type: String,
        trim: true,
      },
    },

    // 🧾 SPECIAL REQUEST
    specialRequest: {
      type: String,
      trim: true,
    },

    // 🟢 STATUS FLOW
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

    // ❌ CANCELLATION
    cancellation: {
      reason: String,
      cancelledAt: Date,
      cancelledBy: {
        type: String,
        enum: ["customer", "restaurant", "admin"],
      },
    },

    // ⏰ CHECK-IN / CHECK-OUT
    checkedInAt: Date,
    completedAt: Date,

    // 💰 ADVANCE / COVER CHARGE
    advancePayment: {
      amount: {
        type: Number,
        min: 0,
      },
      payment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Payment",
      },
      isRefundable: {
        type: Boolean,
        default: true,
      },
    },

    // 🧠 META
    source: {
      type: String,
      enum: ["app", "web", "walk-in"],
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
tableBookingSchema.index({
  restaurant: 1,
  table: 1,
  bookingDate: 1,
  startTime: 1,
});
tableBookingSchema.index({ user: 1, bookingDate: -1 });
tableBookingSchema.index({ status: 1, bookingDate: 1 });

// 🧠 METHODS

// Confirm booking
tableBookingSchema.methods.confirm = function () {
  this.status = "confirmed";
  return this.save();
};

// Cancel booking
tableBookingSchema.methods.cancel = function (reason, by) {
  this.status = "cancelled";
  this.cancellation = {
    reason,
    cancelledAt: new Date(),
    cancelledBy: by,
  };
  return this.save();
};

const TableBooking = mongoose.model(
  "TableBooking",
  tableBookingSchema
);

export default TableBooking;
