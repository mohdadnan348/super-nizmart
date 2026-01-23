import mongoose from "mongoose";

const propertyVisitSchema = new mongoose.Schema(
  {
    // 🔗 PROPERTY
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      required: true,
      index: true,
    },

    // 👤 VISITOR (Buyer / Tenant)
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // 👤 OWNER / BROKER
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // 👤 ASSIGNED AGENT (optional)
    agent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },

    // 📅 VISIT SCHEDULE
    visitDate: {
      type: Date,
      required: true,
      index: true,
    },

    visitTime: {
      type: String, // "11:30"
      required: true,
    },

    durationMinutes: {
      type: Number,
      default: 30,
    },

    // 📞 CONTACT DETAILS
    contact: {
      name: {
        type: String,
        trim: true,
      },
      phone: {
        type: String,
        trim: true,
      },
    },

    // 🟢 STATUS FLOW
    status: {
      type: String,
      enum: [
        "requested",
        "confirmed",
        "rescheduled",
        "completed",
        "cancelled",
        "no-show",
      ],
      default: "requested",
      index: true,
    },

    // 🔁 RESCHEDULE INFO
    reschedule: {
      previousDate: Date,
      previousTime: String,
      rescheduledBy: {
        type: String,
        enum: ["user", "owner", "agent"],
      },
      reason: String,
    },

    // ❌ CANCELLATION
    cancellation: {
      reason: String,
      cancelledAt: Date,
      cancelledBy: {
        type: String,
        enum: ["user", "owner", "agent", "admin"],
      },
    },

    // 📝 FEEDBACK (post visit)
    feedback: {
      interested: {
        type: Boolean,
      },
      comment: {
        type: String,
        trim: true,
      },
      rating: {
        type: Number,
        min: 1,
        max: 5,
      },
    },

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
propertyVisitSchema.index({ property: 1, visitDate: 1 });
propertyVisitSchema.index({ user: 1, createdAt: -1 });
propertyVisitSchema.index({ owner: 1, status: 1 });
propertyVisitSchema.index({ agent: 1, visitDate: 1 });

// 🧠 METHODS

// Confirm visit
propertyVisitSchema.methods.confirm = function () {
  this.status = "confirmed";
  return this.save();
};

// Complete visit
propertyVisitSchema.methods.complete = function (feedback) {
  this.status = "completed";
  if (feedback) {
    this.feedback = feedback;
  }
  return this.save();
};

// Cancel visit
propertyVisitSchema.methods.cancel = function (reason, by) {
  this.status = "cancelled";
  this.cancellation = {
    reason,
    cancelledAt: new Date(),
    cancelledBy: by,
  };
  return this.save();
};

const PropertyVisit = mongoose.model(
  "PropertyVisit",
  propertyVisitSchema
);

export default PropertyVisit;
