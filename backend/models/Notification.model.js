import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    // 👤 RECEIVER (single user)
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // 🧩 ROLE (fast filtering / panels)
    role: {
      type: String,
      enum: [
        "admin",
        "customer",
        "service-provider",
        "seller-b2c",
        "seller-b2b",
        "restaurant",
        "doctor",
        "advocate",
        "hotel",
        "driver",
        "bike-owner",
        "cinema-owner",
        "property-owner",
      ],
      index: true,
    },

    // 🏷️ TYPE / CATEGORY
    type: {
      type: String,
      enum: [
        "system",
        "order",
        "booking",
        "payment",
        "wallet",
        "commission",
        "review",
        "support",
        "promotion",
      ],
      default: "system",
      index: true,
    },

    // 🧾 CONTENT
    title: {
      type: String,
      required: true,
      trim: true,
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },

    // 🔗 ACTION / REDIRECT
    action: {
      url: {
        type: String, // frontend route or deep link
      },
      data: {
        type: Object, // any extra payload (ids, params)
      },
    },

    // 📡 CHANNELS
    channels: {
      inApp: {
        type: Boolean,
        default: true,
      },
      push: {
        type: Boolean,
        default: false,
      },
      email: {
        type: Boolean,
        default: false,
      },
      sms: {
        type: Boolean,
        default: false,
      },
    },

    // 🟢 READ / DELIVERY STATUS
    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },

    readAt: {
      type: Date,
    },

    isSent: {
      type: Boolean,
      default: true, // in-app by default sent
    },

    sentAt: {
      type: Date,
      default: Date.now,
    },

    // ⏱️ SCHEDULE (optional)
    scheduledAt: {
      type: Date,
      index: true,
    },

    // 🟢 PRIORITY
    priority: {
      type: String,
      enum: ["low", "normal", "high"],
      default: "normal",
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

// 🔍 INDEXES (performance)
notificationSchema.index({ user: 1, isRead: 1, createdAt: -1 });
notificationSchema.index({ role: 1, type: 1 });
notificationSchema.index({ scheduledAt: 1 });

// 🧠 METHODS

// Mark as read
notificationSchema.methods.markAsRead = function () {
  this.isRead = true;
  this.readAt = new Date();
  return this.save();
};

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
