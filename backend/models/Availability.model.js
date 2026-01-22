import mongoose from "mongoose";

const availabilitySchema = new mongoose.Schema(
  {
    // 👤 SERVICE PROVIDER
    provider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // 🔗 SERVICE (optional – provider level ya service level)
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      index: true,
    },

    // 📅 AVAILABILITY TYPE
    type: {
      type: String,
      enum: ["weekly", "date-specific"],
      default: "weekly",
      index: true,
    },

    // 🗓️ WEEKLY SCHEDULE (Mon–Sun)
    weekly: {
      monday: [
        {
          startTime: String, // "09:00"
          endTime: String,   // "12:00"
        },
      ],
      tuesday: [
        {
          startTime: String,
          endTime: String,
        },
      ],
      wednesday: [
        {
          startTime: String,
          endTime: String,
        },
      ],
      thursday: [
        {
          startTime: String,
          endTime: String,
        },
      ],
      friday: [
        {
          startTime: String,
          endTime: String,
        },
      ],
      saturday: [
        {
          startTime: String,
          endTime: String,
        },
      ],
      sunday: [
        {
          startTime: String,
          endTime: String,
        },
      ],
    },

    // 📆 DATE-SPECIFIC AVAILABILITY (override)
    dateSpecific: [
      {
        date: {
          type: Date,
          index: true,
        },
        slots: [
          {
            startTime: String,
            endTime: String,
            isBooked: {
              type: Boolean,
              default: false,
            },
            booking: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "Booking",
            },
          },
        ],
      },
    ],

    // ⏱️ SLOT SETTINGS
    slotDuration: {
      type: Number, // minutes
      default: 60,
    },

    bufferTime: {
      type: Number, // minutes between slots
      default: 0,
    },

    timezone: {
      type: String,
      default: "Asia/Kolkata",
    },

    // 🟢 STATUS
    isActive: {
      type: Boolean,
      default: true,
      index: true,
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
availabilitySchema.index({ provider: 1, service: 1 });
availabilitySchema.index({ isActive: 1 });

// 🧠 METHODS

// Check if provider available on date
availabilitySchema.methods.isAvailableOnDate = function (date) {
  const day = new Date(date)
    .toLocaleDateString("en-US", { weekday: "long" })
    .toLowerCase();

  return this.weekly?.[day]?.length > 0;
};

const Availability = mongoose.model(
  "Availability",
  availabilitySchema
);

export default Availability;
