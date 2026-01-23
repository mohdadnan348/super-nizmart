import mongoose from "mongoose";

const screenSchema = new mongoose.Schema(
  {
    // 🔗 CINEMA
    cinema: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cinema",
      required: true,
      index: true,
    },

    // 🎥 BASIC INFO
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
      /*
        Examples:
        Screen 1, Audi 2, IMAX Screen
      */
    },

    screenNumber: {
      type: Number,
      index: true,
    },

    // 🎬 FORMAT
    format: {
      type: String,
      enum: ["2D", "3D", "IMAX", "4DX"],
      default: "2D",
      index: true,
    },

    // 🔊 SOUND SYSTEM
    soundSystem: {
      type: String,
      enum: ["Dolby", "Dolby Atmos", "DTS", "IMAX Sound"],
      index: true,
    },

    // 🪑 SEATING INFO (summary)
    seating: {
      totalSeats: {
        type: Number,
        required: true,
        min: 1,
      },
      rows: {
        type: Number,
        min: 1,
      },
      columns: {
        type: Number,
        min: 1,
      },
    },

    // 🗂️ SEAT CATEGORIES (pricing tiers)
    seatCategories: [
      {
        name: {
          type: String,
          trim: true,
          /*
            Silver, Gold, Platinum, Recliner
          */
        },
        priceMultiplier: {
          type: Number,
          default: 1,
          min: 0.5,
        },
        colorCode: String, // UI purpose
      },
    ],

    // 🟢 STATUS
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },

    isMaintenance: {
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
screenSchema.index({ cinema: 1, name: 1 }, { unique: true });
screenSchema.index({ cinema: 1, isActive: 1 });
screenSchema.index({ format: 1 });

// 🧠 METHODS

// Put screen under maintenance
screenSchema.methods.markMaintenance = function () {
  this.isMaintenance = true;
  return this.save();
};

// Activate screen
screenSchema.methods.activate = function () {
  this.isMaintenance = false;
  this.isActive = true;
  return this.save();
};

const Screen = mongoose.model("Screen", screenSchema);

export default Screen;
