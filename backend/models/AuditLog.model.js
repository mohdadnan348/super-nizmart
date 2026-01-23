import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema(
  {
    // 👤 ACTOR (user / admin / system)
    actor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
      /*
        null = system / cron / webhook
      */
    },

    actorRole: {
      type: String,
      enum: ["user", "admin", "system"],
      default: "user",
      index: true,
    },

    // 🏷️ ACTION
    action: {
      type: String,
      required: true,
      trim: true,
      index: true,
      /*
        Examples:
        USER_LOGIN
        PASSWORD_CHANGE
        PAYMENT_SUCCESS
        BOOKING_CANCELLED
        TICKET_USED
      */
    },

    actionType: {
      type: String,
      enum: ["create", "update", "delete", "login", "logout", "payment", "system", "other"],
      index: true,
    },

    // 🔗 ENTITY
    entityType: {
      type: String,
      trim: true,
      index: true,
      /*
        User, Booking, Payment, Property, Ride, Ticket
      */
    },

    entityId: {
      type: mongoose.Schema.Types.ObjectId,
      index: true,
    },

    // 📦 PAYLOAD SNAPSHOT
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      /*
        Request payload, response snapshot, etc.
      */
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

    // 🚨 SEVERITY
    severity: {
      type: String,
      enum: ["info", "warning", "error", "critical"],
      default: "info",
      index: true,
    },

    // 🧠 MODULE
    module: {
      type: String,
      trim: true,
      index: true,
      /*
        auth, payment, booking, cinema, property, ride
      */
    },

    // 🕒 TIMESTAMP (explicit for audit)
    occurredAt: {
      type: Date,
      default: Date.now,
      index: true,
    },

    // 🔒 IMMUTABLE FLAG
    immutable: {
      type: Boolean,
      default: true,
      /*
        true = never editable
      */
    },

    // 🗑️ SOFT DELETE (almost never used)
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
auditLogSchema.index({ actor: 1, occurredAt: -1 });
auditLogSchema.index({ entityType: 1, entityId: 1 });
auditLogSchema.index({ module: 1, actionType: 1 });
auditLogSchema.index({ severity: 1, occurredAt: -1 });

// 🧠 STATIC HELPERS

// Create audit log easily
auditLogSchema.statics.log = function ({
  actor = null,
  actorRole = "system",
  action,
  actionType,
  entityType,
  entityId,
  metadata,
  ipAddress,
  userAgent,
  severity = "info",
  module,
}) {
  return this.create({
    actor,
    actorRole,
    action,
    actionType,
    entityType,
    entityId,
    metadata,
    ipAddress,
    userAgent,
    severity,
    module,
    occurredAt: new Date(),
  });
};

const AuditLog = mongoose.model("AuditLog", auditLogSchema);

export default AuditLog;
