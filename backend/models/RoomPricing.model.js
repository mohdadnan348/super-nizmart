import mongoose from "mongoose";

const roomPricingSchema = new mongoose.Schema(
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

    // 🏷️ PRICING TYPE
    pricingType: {
      type: String,
      enum: ["base", "seasonal", "special"],
      default: "base",
      index: true,
      /*
        base      = default price
        seasonal  = festive / peak season
        special   = date-range override / offer
      */
    },

    // 📅 DATE RANGE (for seasonal / special)
    dateRange: {
      startDate: {
        type: Date,
        index: true,
      },
      endDate: {
        type: Date,
        index: true,
      },
    },

    // 📆 DAY BASED PRICING
    applicableDays: {
      type: [String],
      enum: [
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
        "sunday",
      ],
      /*
        Empty = all days
      */
    },

    // 💰 PRICE DETAILS
    pricePerNight: {
      type: Number,
      required: true,
      min: 0,
    },

    extraGuestCharge: {
      type: Number,
      default: 0,
      min: 0,
    },

    extraBedCharge: {
      type: Number,
      default: 0,
      min: 0,
    },

    // 🧾 TAX
    tax: {
      percentage: {
        type: Number,
        min: 0,
        max: 28,
        default: 0,
      },
      isIncluded: {
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

    priority: {
      type: Number,
      default: 1,
      /*
        Higher priority pricing overrides lower
      */
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
roomPricingSchema.index({
  room: 1,
  pricingType: 1,
  "dateRange.startDate": 1,
  "dateRange.endDate": 1,
});
roomPricingSchema.index({ hotel: 1, isActive: 1 });

// 🧠 METHODS

// Check if pricing applicable on date
roomPricingSchema.methods.isApplicableOnDate = function (date) {
  if (this.dateRange?.startDate && this.dateRange?.endDate) {
    if (date < this.dateRange.startDate || date > this.dateRange.endDate) {
      return false;
    }
  }

  if (this.applicableDays && this.applicableDays.length > 0) {
    const day = new Date(date)
      .toLocaleDateString("en-US", { weekday: "long" })
      .toLowerCase();
    return this.applicableDays.includes(day);
  }

  return true;
};

const RoomPricing = mongoose.model(
  "RoomPricing",
  roomPricingSchema
);

export default RoomPricing;
