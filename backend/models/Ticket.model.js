import mongoose from "mongoose";

const seatSnapshotSchema = new mongoose.Schema(
  {
    seat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Seat",
      required: true,
    },
    seatNumber: {
      type: String,
      required: true,
    },
    row: String,
    column: Number,
    category: {
      type: String, // Silver / Gold / Platinum / Recliner
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: false }
);

const ticketSchema = new mongoose.Schema(
  {
    // 🔗 USER
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // 🔗 CINEMA / SHOW / MOVIE
    cinema: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cinema",
      required: true,
      index: true,
    },

    screen: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Screen",
      required: true,
      index: true,
    },

    show: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Show",
      required: true,
      index: true,
    },

    movie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Movie",
      required: true,
      index: true,
    },

    // 🎟️ TICKET META
    ticketNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
      /*
        Example:
        BMS-2026-000987
      */
    },

    // 🪑 SEATS (SNAPSHOT)
    seats: {
      type: [seatSnapshotSchema],
      required: true,
      validate: [(v) => v.length > 0, "At least one seat required"],
    },

    seatCount: {
      type: Number,
      required: true,
      min: 1,
    },

    // 💰 PRICING SNAPSHOT
    pricing: {
      subTotal: {
        type: Number,
        required: true,
        min: 0,
      },
      convenienceFee: {
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

    // 🟢 TICKET STATUS
    status: {
      type: String,
      enum: [
        "reserved",
        "confirmed",
        "cancelled",
        "refunded",
        "used",
        "expired",
      ],
      default: "reserved",
      index: true,
    },

    // 📲 ENTRY / CHECK-IN
    qrCode: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Document",
    },

    checkedInAt: {
      type: Date,
    },

    // ❌ CANCELLATION / REFUND
    cancellation: {
      reason: String,
      cancelledAt: Date,
      cancelledBy: {
        type: String,
        enum: ["user", "cinema", "admin"],
      },
    },

    refund: {
      amount: Number,
      refundedAt: Date,
      payment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Payment",
      },
    },

    // 🧠 META
    source: {
      type: String,
      enum: ["app", "web", "admin"],
      default: "app",
    },

    notes: {
      type: String,
      trim: true,
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
ticketSchema.index({ show: 1, status: 1 });
ticketSchema.index({ user: 1, createdAt: -1 });
ticketSchema.index({ ticketNumber: 1 });
ticketSchema.index({ paymentStatus: 1 });

// 🧠 METHODS

// Confirm ticket (after payment success)
ticketSchema.methods.confirm = function () {
  this.status = "confirmed";
  this.paymentStatus = "paid";
  return this.save();
};

// Mark ticket used (entry scan)
ticketSchema.methods.markUsed = function () {
  this.status = "used";
  this.checkedInAt = new Date();
  return this.save();
};

// Cancel ticket
ticketSchema.methods.cancel = function (reason, by) {
  this.status = "cancelled";
  this.cancellation = {
    reason,
    cancelledAt: new Date(),
    cancelledBy: by,
  };
  return this.save();
};

const Ticket = mongoose.model("Ticket", ticketSchema);

export default Ticket;
