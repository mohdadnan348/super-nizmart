import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    // 👤 PATIENT / CLIENT
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // 👨‍⚕️ / ⚖️ PROVIDER (Doctor / Advocate)
    provider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    providerType: {
      type: String,
      enum: ["doctor", "advocate"],
      required: true,
      index: true,
    },

    // 🔗 PROFILE LINKS
    doctorProfile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DoctorProfile",
    },

    advocateProfile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AdvocateProfile",
    },

    // 🕒 APPOINTMENT SLOT
    appointmentDate: {
      type: Date,
      required: true,
      index: true,
    },

    startTime: {
      type: String, // "10:30"
      required: true,
    },

    endTime: {
      type: String, // "11:00"
      required: true,
    },

    durationMinutes: {
      type: Number,
      default: 30,
    },

    // 🏥 MODE
    mode: {
      type: String,
      enum: ["clinic", "online", "home", "chamber", "phone"],
      required: true,
      index: true,
    },

    // 📍 LOCATION (clinic / chamber)
    location: {
      name: String,
      address: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Address",
      },
    },

    // 🧾 REASON
    reason: {
      type: String,
      trim: true,
    },

    // 💰 FEES
    fee: {
      amount: {
        type: Number,
        required: true,
        min: 0,
      },
      currency: {
        type: String,
        default: "INR",
      },
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

    // 🟢 STATUS FLOW
    status: {
      type: String,
      enum: [
        "scheduled",
        "confirmed",
        "checked-in",
        "completed",
        "cancelled",
        "no-show",
      ],
      default: "scheduled",
      index: true,
    },

    // ❌ CANCELLATION
    cancellation: {
      reason: String,
      cancelledAt: Date,
      cancelledBy: {
        type: String,
        enum: ["user", "provider", "admin"],
      },
    },

    // 🕓 TIMESTAMPS
    confirmedAt: Date,
    checkedInAt: Date,
    completedAt: Date,

    // 🧠 META
    notes: {
      type: String,
      trim: true,
    },

    source: {
      type: String,
      enum: ["app", "web", "admin"],
      default: "app",
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
appointmentSchema.index({
  provider: 1,
  appointmentDate: 1,
  startTime: 1,
});
appointmentSchema.index({ user: 1, appointmentDate: -1 });
appointmentSchema.index({ status: 1, paymentStatus: 1 });

// 🧠 METHODS

// Confirm appointment
appointmentSchema.methods.confirm = function () {
  this.status = "confirmed";
  this.confirmedAt = new Date();
  return this.save();
};

// Cancel appointment
appointmentSchema.methods.cancel = function (reason, by) {
  this.status = "cancelled";
  this.cancellation = {
    reason,
    cancelledAt: new Date(),
    cancelledBy: by,
  };
  return this.save();
};

const Appointment = mongoose.model(
  "Appointment",
  appointmentSchema
);

export default Appointment;
