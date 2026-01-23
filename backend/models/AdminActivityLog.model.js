import mongoose from "mongoose";

const adminActivityLogSchema = new mongoose.Schema(
  {
    // 👤 ADMIN USER
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // 🏷️ ACTION INFO
    action: {
      type: String,
      required: true,
      trim: true,
      index: true,
      /*
        Examples:
        CREATE_USER
        UPDATE_PROPERTY
        APPROVE_HOTEL
        BLOCK_DRIVER
        REFUND_PAYMENT
      */
    },

    actionType: {
      type: String,
      enum: ["create", "update", "delete", "approve", "reject", "block", "unblock", "refund", "other"],
      index: true,
    },

    // 🔗 TARGET ENTITY
    entityType: {
      type: String,
      required: true,
      trim: true,
      index: true,
      /*
        User, Property, Hotel, Booking, Payment, Movie
      */
    },

    entityId: {
      type: mongoose.Schema.Types.ObjectId,
      index: true,
    },

    // 📦 CHANGE SNAPSHOT
    changes: {
      before: {
        type: mongoose.Schema.Types.Mixed,
      },
      after: {
        type: mongoose.Schema.Types.Mixed,
      },
    },

    // 🌐 REQUEST CONTEXT
    ipAddress: {
      type: String,
      trim: true,
    },

    userAgent: {
      type: String,
      trim: true,
    },

    // 🧠 META
    reason: {
      type: String,
      trim: true,
      /*
        Optional admin note / justification
      */
    },

    module: {
      type: String,
      trim: true,
      index: true,
      /*
        auth, property, hotel, cinema, ride, payment
      */
    },

    severity: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      default: "low",
      index: true,
    },

    // 🗑️ SOFT DELETE (rarely used, but safe)
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
adminActivityLogSchema.index({ admin: 1, createdAt: -1 });
adminActivityLogSchema.index({ entityType: 1, entityId: 1 });
adminActivityLogSchema.index({ module: 1, actionType: 1 });
adminActivityLogSchema.index({ severity: 1, createdAt: -1 });

// 🧠 STATIC HELPERS

// Create log easily
adminActivityLogSchema.statics.log = function ({
  admin,
  action,
  actionType,
  entityType,
  entityId,
  before,
  after,
  ipAddress,
  userAgent,
  reason,
  module,
  severity = "low",
}) {
  return this.create({
    admin,
    action,
    actionType,
    entityType,
    entityId,
    changes: { before, after },
    ipAddress,
    userAgent,
    reason,
    module,
    severity,
  });
};

const AdminActivityLog = mongoose.model(
  "AdminActivityLog",
  adminActivityLogSchema
);

export default AdminActivityLog;
