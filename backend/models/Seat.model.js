import mongoose from "mongoose";

const seatSchema = new mongoose.Schema(
  {
    // 🔗 CINEMA & SCREEN
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

    // 🪑 SEAT IDENTITY
    seatNumber: {
      type: String,
      required: true,
      trim: true,
      /*
        Examples:
        A1, A2, B10
      */
    },

    row: {
      type: String, // A, B, C
      required: true,
      index: true,
    },

    column: {
      type: Number, // 1, 2, 3
      required: true,
      index: true,
    },

    // 🏷️ CATEGORY / TIER
    category: {
      type: String,
      required: true,
      trim: true,
      index: true,
      /*
        Silver, Gold, Platinum, Recliner
        Must match Screen.seatCategories.name
      */
    },

    // ♿ FEATURES
    features: {
      isWheelchairAccessible: {
        type: Boolean,
        default: false,
        index: true,
      },
      isCoupleSeat: {
        type: Boolean,
        default: false,
      },
      isRecliner: {
        type: Boolean,
        default: false,
      },
    },

    // 🟢 STATUS
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },

    isUnderMaintenance: {
      type: Boolean,
      default: false,
      index: true,
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
seatSchema.index(
  { screen: 1, row: 1, column: 1 },
  { unique: true }
);
seatSchema.index({ screen: 1, category: 1 });
seatSchema.index({ isActive: 1, isUnderMaintenance: 1 });

// 🧠 METHODS

// Disable seat (maintenance)
seatSchema.methods.markMaintenance = function () {
  this.isUnderMaintenance = true;
  this.isActive = false;
  return this.save();
};

// Enable seat
seatSchema.methods.activate = function () {
  this.isUnderMaintenance = false;
  this.isActive = true;
  return this.save();
};

const Seat = mongoose.model("Seat", seatSchema);

export default Seat;
