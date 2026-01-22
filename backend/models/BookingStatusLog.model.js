import mongoose from "mongoose";

const bookingStatusLogSchema = new mongoose.Schema(
  {
    // 🔗 BOOKING LINK
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
      index: true,
    },

    // 🔄 STATUS CHANGE
    previousStatus: {
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
    },

    newStatus: {
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
      required: true,
      index: true,
    },

    // 👤 ACTION BY
    changedBy: {
      type: String,
      enum: ["customer", "provider", "admin", "system"],
      required: true,
      index: true,
    },

    // 🔗 USER (who triggered, optional)
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },

    // 🧠 CONTEXT / REASON
    reason: {
      type: String,
      trim: true,
    },

    notes: {
      type: String,
      trim: true,
    },

    // 🌐 META (debug / audit)
    meta: {
      ipAddress: String,
      userAgent: String,
      source: {
        type: String,
        enum: ["web", "android", "ios", "api"],
        default: "api",
      },
    },
  },
  {
    timestamps: true,
  }
);

// 🔍 INDEXES (fast audit queries)
bookingStatusLogSchema.index({ booking: 1, createdAt: -1 });
bookingStatusLogSchema.index({ newStatus: 1, createdAt: -1 });
bookingStatusLogSchema.index({ changedBy: 1 });

// 🧠 STATIC: LOG STATUS CHANGE
bookingStatusLogSchema.statics.logStatusChange = function ({
  booking,
  previousStatus,
  newStatus,
  changedBy,
  user,
  reason,
  notes,
  meta = {},
}) {
  return this.create({
    booking,
    previousStatus,
    newStatus,
    changedBy,
    user,
    reason,
    notes,
    meta,
  });
};

const BookingStatusLog = mongoose.model(
  "BookingStatusLog",
  bookingStatusLogSchema
);

export default BookingStatusLog;
