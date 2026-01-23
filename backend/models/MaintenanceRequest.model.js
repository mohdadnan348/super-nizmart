import mongoose from "mongoose";

const maintenanceRequestSchema = new mongoose.Schema(
  {
    // 🏠 PROPERTY
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      required: true,
      index: true,
    },

    // 👤 REQUESTED BY (Tenant / Owner)
    requestedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    requesterRole: {
      type: String,
      enum: ["tenant", "owner"],
      required: true,
      index: true,
    },

    // 👤 TENANT (optional)
    tenant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
      index: true,
    },

    // 🛠️ ISSUE DETAILS
    category: {
      type: String,
      enum: [
        "plumbing",
        "electrical",
        "carpentry",
        "appliance",
        "civil",
        "other",
      ],
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    // 📸 MEDIA
    images: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Document",
      },
    ],

    // 🚦 PRIORITY
    priority: {
      type: String,
      enum: ["low", "medium", "high", "emergency"],
      default: "medium",
      index: true,
    },

    // 👷 ASSIGNMENT
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
      /*
        technician / vendor
      */
    },

    assignedAt: Date,

    // 🟢 STATUS FLOW
    status: {
      type: String,
      enum: [
        "open",
        "assigned",
        "in-progress",
        "resolved",
        "closed",
        "cancelled",
      ],
      default: "open",
      index: true,
    },

    // 💰 COSTING
    cost: {
      estimated: {
        type: Number,
        default: 0,
      },
      actual: {
        type: Number,
        default: 0,
      },
      paidBy: {
        type: String,
        enum: ["tenant", "owner"],
      },
      payment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Payment",
      },
    },

    // 🕒 TIMELINE
    resolvedAt: Date,
    closedAt: Date,

    // 📝 FEEDBACK
    feedback: {
      rating: {
        type: Number,
        min: 1,
        max: 5,
      },
      comment: {
        type: String,
        trim: true,
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
maintenanceRequestSchema.index({ property: 1, status: 1 });
maintenanceRequestSchema.index({ assignedTo: 1, status: 1 });
maintenanceRequestSchema.index({ category: 1, priority: 1 });
maintenanceRequestSchema.index({ requesterRole: 1, status: 1 });

// 🧠 METHODS

// Assign request
maintenanceRequestSchema.methods.assign = function (userId) {
  this.assignedTo = userId;
  this.status = "assigned";
  this.assignedAt = new Date();
  return this.save();
};

// Resolve request
maintenanceRequestSchema.methods.resolve = function (actualCost = 0) {
  this.status = "resolved";
  this.cost.actual = actualCost;
  this.resolvedAt = new Date();
  return this.save();
};

// Close request
maintenanceRequestSchema.methods.close = function () {
  this.status = "closed";
  this.closedAt = new Date();
  return this.save();
};

const MaintenanceRequest = mongoose.model(
  "MaintenanceRequest",
  maintenanceRequestSchema
);

export default MaintenanceRequest;
