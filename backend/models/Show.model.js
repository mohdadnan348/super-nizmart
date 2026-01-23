import mongoose from "mongoose";

const pricingTierSchema = new mongoose.Schema(
  {
    category: {
      type: String, // Silver / Gold / Platinum / Recliner
      required: true,
      trim: true,
      index: true,
    },
    basePrice: {
      type: Number,
      required: true,
      min: 0,
    },
    convenienceFee: {
      type: Number,
      default: 0,
    },
    taxPercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 28,
    },
  },
  { _id: false }
);

const showSchema = new mongoose.Schema(
  {
    // 🔗 CINEMA / SCREEN / MOVIE
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

    movie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Movie",
      required: true,
      index: true,
    },

    // 🎞️ FORMAT & LANGUAGE
    format: {
      type: String,
      enum: ["2D", "3D", "IMAX", "4DX"],
      default: "2D",
      index: true,
    },

    language: {
      type: String,
      required: true,
      index: true,
    },

    // 🕒 SHOW TIME
    showDate: {
      type: Date,
      required: true,
      index: true,
    },

    startTime: {
      type: String, // "18:30"
      required: true,
    },

    endTime: {
      type: String, // auto-calc from movie duration (optional)
      required: true,
    },

    // 💰 PRICING (per seat category)
    pricing: {
      type: [pricingTierSchema],
      required: true,
      validate: [(v) => v.length > 0, "Pricing tiers required"],
    },

    // 🪑 SEATS SUMMARY (snapshot for fast reads)
    seats: {
      total: {
        type: Number,
        required: true,
        min: 1,
      },
      available: {
        type: Number,
        required: true,
        min: 0,
      },
      blocked: {
        type: Number,
        default: 0, // temporarily locked (Redis + DB counter)
      },
      sold: {
        type: Number,
        default: 0,
      },
    },

    // 🧮 LOCKING (high concurrency support)
    lockTTLSeconds: {
      type: Number,
      default: 300, // 5 minutes
    },

    // 🟢 STATUS FLOW
    status: {
      type: String,
      enum: ["scheduled", "open", "sold-out", "cancelled", "completed"],
      default: "scheduled",
      index: true,
    },

    // ❌ CANCELLATION (show-level)
    cancellation: {
      reason: String,
      cancelledAt: Date,
      cancelledBy: {
        type: String,
        enum: ["cinema", "admin"],
      },
    },

    // 🧠 META
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
showSchema.index({ cinema: 1, showDate: 1, startTime: 1 });
showSchema.index({ movie: 1, showDate: 1 });
showSchema.index({ screen: 1, showDate: 1 });
showSchema.index({ status: 1, showDate: 1 });

// 🧠 METHODS

// Open booking
showSchema.methods.openBooking = function () {
  this.status = "open";
  return this.save();
};

// Mark sold out
showSchema.methods.markSoldOut = function () {
  this.status = "sold-out";
  return this.save();
};

// Increment seat counters (atomic intent; actual locking via Redis)
showSchema.methods.incrementCounters = function ({ sold = 0, blocked = 0 }) {
  this.seats.sold += sold;
  this.seats.blocked += blocked;
  this.seats.available = Math.max(
    0,
    this.seats.total - this.seats.sold - this.seats.blocked
  );
  return this.save();
};

// Cancel show
showSchema.methods.cancelShow = function (reason, by) {
  this.status = "cancelled";
  this.cancellation = {
    reason,
    cancelledAt: new Date(),
    cancelledBy: by,
  };
  return this.save();
};

const Show = mongoose.model("Show", showSchema);

export default Show;
