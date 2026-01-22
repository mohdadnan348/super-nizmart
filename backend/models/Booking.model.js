import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    // 👤 CUSTOMER
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // 👨‍🔧 SERVICE PROVIDER
    provider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // 🧰 SERVICE
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
      index: true,
    },

    // 🗂️ CATEGORY (denormalized for faster queries)
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ServiceCategory",
      index: true,
    },

    // 📍 SERVICE ADDRESS (customer location)
    address: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
      required: true,
    },

    // ⏱️ BOOKING SLOT
    schedule: {
      date: {
        type: Date,
        required: true,
        index: true,
      },
      startTime: {
        type: String, // "10:00"
        required: true,
      },
      endTime: {
        type: String, // "11:00"
        required: true,
      },
      timezone: {
        type: String,
        default: "Asia/Kolkata",
      },
    },

    // 💰 PRICING SNAPSHOT (at booking time)
    pricing: {
      basePrice: {
        type: Number,
        required: true,
      },
      optionName: {
        type: String, // if variant selected
      },
      optionPrice: {
        type: Number,
      },
      taxAmount: {
        type: Number,
        default: 0,
      },
      discountAmount: {
        type: Number,
        default: 0,
      },
      totalAmount: {
        type: Number,
        required: true,
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
      index: true,
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
        "assigned",
        "in-progress",
        "completed",
        "cancelled",
        "no-show",
      ],
      default: "pending",
      index: true,
    },

    // ❌ CANCELLATION
    cancellation: {
      cancelledBy: {
        type: String,
        enum: ["customer", "provider", "admin"],
      },
      reason: {
        type: String,
        trim: true,
      },
      cancelledAt: {
        type: Date,
      },
      refundAmount: {
        type: Number,
      },
    },

    // 🧾 INVOICE
    invoice: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Document",
    },

    // ⭐ REVIEW LINK
    review: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review",
    },

    // 🧠 NOTES
    customerNotes: {
      type: String,
      trim: true,
    },

    providerNotes: {
      type: String,
      trim: true,
    },

    // 🟢 FLAGS
    isRescheduled: {
      type: Boolean,
      default: false,
    },

    rescheduledFrom: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
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

// 🔍 INDEXES (performance)
bookingSchema.index({ provider: 1, "schedule.date": 1 });
bookingSchema.index({ user: 1, createdAt: -1 });
bookingSchema.index({ status: 1, paymentStatus: 1 });

// 🧠 METHODS

// Cancel booking
bookingSchema.methods.cancel = function ({
  by,
  reason,
  refundAmount = 0,
}) {
  this.status = "cancelled";
  this.cancellation = {
    cancelledBy: by,
    reason,
    cancelledAt: new Date(),
    refundAmount,
  };
  return this.save();
};

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;
