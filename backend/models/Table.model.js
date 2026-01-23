import mongoose from "mongoose";

const tableSchema = new mongoose.Schema(
  {
    // 🔗 RESTAURANT
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
      index: true,
    },

    // 🪑 TABLE BASIC INFO
    tableNumber: {
      type: String,
      required: true,
      trim: true,
      index: true,
      /*
        Examples:
        T1, A-05, VIP-2
      */
    },

    name: {
      type: String,
      trim: true,
      /*
        Optional display name:
        "Window Table", "Family Table"
      */
    },

    // 👥 CAPACITY
    capacity: {
      type: Number,
      required: true,
      min: 1,
      index: true,
    },

    minCapacity: {
      type: Number,
      min: 1,
    },

    // 📍 LOCATION INSIDE RESTAURANT
    section: {
      type: String,
      trim: true,
      /*
        Examples:
        Ground Floor, AC Section, Outdoor
      */
    },

    // 🔳 QR / SCAN (self order)
    qrCode: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Document",
    },

    // 🟢 STATUS
    status: {
      type: String,
      enum: ["available", "occupied", "reserved", "out-of-service"],
      default: "available",
      index: true,
    },

    // ⏰ AVAILABILITY
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },

    // 🧠 FEATURES
    features: {
      isAC: {
        type: Boolean,
        default: false,
      },
      isSmokingAllowed: {
        type: Boolean,
        default: false,
      },
      isVIP: {
        type: Boolean,
        default: false,
        index: true,
      },
    },

    // 📊 STATS
    stats: {
      totalBookings: {
        type: Number,
        default: 0,
      },
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
tableSchema.index({ restaurant: 1, tableNumber: 1 }, { unique: true });
tableSchema.index({ restaurant: 1, capacity: 1 });
tableSchema.index({ status: 1, isActive: 1 });

// 🧠 METHODS

// Mark table occupied
tableSchema.methods.markOccupied = function () {
  this.status = "occupied";
  return this.save();
};

// Mark table available
tableSchema.methods.markAvailable = function () {
  this.status = "available";
  return this.save();
};

const Table = mongoose.model("Table", tableSchema);

export default Table;
