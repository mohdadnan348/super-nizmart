import mongoose from "mongoose";

const checklistItemSchema = new mongoose.Schema(
  {
    label: {
      type: String,
      trim: true,
      required: true,
    },
    isDone: {
      type: Boolean,
      default: false,
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  { _id: false }
);

const housekeepingSchema = new mongoose.Schema(
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

    // 👤 ASSIGNED STAFF
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
      /*
        role: housekeeping / supervisor
      */
    },

    // 🧹 TASK TYPE
    taskType: {
      type: String,
      enum: ["cleaning", "laundry", "inspection", "maintenance"],
      default: "cleaning",
      index: true,
    },

    // 🟢 STATUS FLOW
    status: {
      type: String,
      enum: ["pending", "in-progress", "completed", "verified"],
      default: "pending",
      index: true,
    },

    // 📅 SCHEDULE
    scheduledDate: {
      type: Date,
      required: true,
      index: true,
    },

    scheduledTime: {
      type: String, // "11:00"
    },

    // ⏱️ ACTUAL TIMING
    startedAt: Date,
    completedAt: Date,
    verifiedAt: Date,

    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    // 🧾 CHECKLIST
    checklist: [checklistItemSchema],

    // 🧠 NOTES / ISSUES
    issuesFound: {
      type: String,
      trim: true,
      /*
        Broken lamp, dirty sheets, plumbing issue
      */
    },

    maintenanceRequired: {
      type: Boolean,
      default: false,
      index: true,
    },

    // 🔗 LINKED BOOKING (post check-out cleaning)
    roomBooking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RoomBooking",
      index: true,
    },

    // 📊 META
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

// 🔍 INDEXES
housekeepingSchema.index({ hotel: 1, scheduledDate: 1 });
housekeepingSchema.index({ room: 1, status: 1 });
housekeepingSchema.index({ assignedTo: 1, status: 1 });
housekeepingSchema.index({ maintenanceRequired: 1 });

// 🧠 METHODS

// Start task
housekeepingSchema.methods.startTask = function () {
  this.status = "in-progress";
  this.startedAt = new Date();
  return this.save();
};

// Complete task
housekeepingSchema.methods.completeTask = function () {
  this.status = "completed";
  this.completedAt = new Date();
  return this.save();
};

// Verify task
housekeepingSchema.methods.verifyTask = function (verifierId) {
  this.status = "verified";
  this.verifiedBy = verifierId;
  this.verifiedAt = new Date();
  return this.save();
};

const HouseKeeping = mongoose.model(
  "HouseKeeping",
  housekeepingSchema
);

export default HouseKeeping;
