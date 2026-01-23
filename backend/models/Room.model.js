import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    // 🔗 HOTEL
    hotel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",
      required: true,
      index: true,
    },

    // 🏷️ BASIC INFO
    roomNumber: {
      type: String,
      trim: true,
      index: true,
      /*
        Optional:
        101, 102, A-1 etc.
      */
    },

    roomType: {
      type: String,
      required: true,
      trim: true,
      index: true,
      /*
        Examples:
        Deluxe, Super Deluxe, Suite
      */
    },

    description: {
      type: String,
      trim: true,
    },

    // 👥 CAPACITY
    capacity: {
      adults: {
        type: Number,
        required: true,
        min: 1,
      },
      children: {
        type: Number,
        default: 0,
      },
      maxGuests: {
        type: Number,
        required: true,
        min: 1,
      },
    },

    // 🛏️ BED INFO
    bedType: {
      type: String,
      trim: true,
      /*
        Single, Double, Queen, King
      */
    },

    bedCount: {
      type: Number,
      default: 1,
      min: 1,
    },

    // 🏷️ AMENITIES (room-level)
    amenities: [
      {
        type: String,
        trim: true,
        index: true,
        /*
          AC, TV, WiFi, Balcony, Mini Bar
        */
      },
    ],

    // 📐 ROOM SIZE
    size: {
      value: Number,
      unit: {
        type: String,
        enum: ["sqft", "sqm"],
        default: "sqft",
      },
    },

    // 🖼️ MEDIA
    images: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Document",
      },
    ],

    // 🟢 AVAILABILITY / INVENTORY
    totalRooms: {
      type: Number,
      required: true,
      min: 1,
      /*
        Same room type ke total rooms
      */
    },

    availableRooms: {
      type: Number,
      required: true,
      min: 0,
    },

    // 🟢 STATUS
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },

    isBookable: {
      type: Boolean,
      default: true,
      index: true,
    },

    // 🧾 EXTRA
    extraBedAllowed: {
      type: Boolean,
      default: false,
    },

    extraBedCharge: {
      type: Number,
      min: 0,
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
roomSchema.index({ hotel: 1, roomType: 1 });
roomSchema.index({ hotel: 1, isActive: 1 });
roomSchema.index({ amenities: 1 });

// 🧠 METHODS

// Reduce available rooms (on booking)
roomSchema.methods.reserveRoom = function (count = 1) {
  if (this.availableRooms < count) {
    throw new Error("Not enough rooms available");
  }
  this.availableRooms -= count;
  this.stats.totalBookings += 1;
  return this.save();
};

// Release rooms (on cancellation)
roomSchema.methods.releaseRoom = function (count = 1) {
  this.availableRooms += count;
  return this.save();
};

const Room = mongoose.model("Room", roomSchema);

export default Room;
