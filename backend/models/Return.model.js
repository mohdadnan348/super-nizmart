import mongoose from "mongoose";

const returnSchema = new mongoose.Schema(
  {
    // 🔗 ORDER LINKS
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
      index: true,
    },

    orderItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "OrderItem",
      required: true,
      index: true,
      unique: true, // ek item ka ek hi return
    },

    // 👤 CUSTOMER
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // 👤 SELLER
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // 🧾 RETURN REASON
    reason: {
      type: String,
      enum: [
        "damaged",
        "defective",
        "wrong_item",
        "size_issue",
        "quality_issue",
        "not_as_described",
        "changed_mind",
        "other",
      ],
      required: true,
      index: true,
    },

    reasonDescription: {
      type: String,
      trim: true,
    },

    // 📎 EVIDENCE (images/videos)
    attachments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Document",
      },
    ],

    // 🟢 RETURN TYPE
    returnType: {
      type: String,
      enum: ["refund", "replacement"],
      default: "refund",
      index: true,
    },

    // 🟢 STATUS FLOW
    status: {
      type: String,
      enum: [
        "requested",
        "approved",
        "rejected",
        "pickup_scheduled",
        "picked_up",
        "received",
        "qc_failed",
        "completed",
      ],
      default: "requested",
      index: true,
    },

    // 🚚 PICKUP / LOGISTICS
    pickup: {
      scheduledAt: Date,
      pickedUpAt: Date,
      courierPartner: String,
      trackingNumber: String,
    },

    // 🧪 QC (Quality Check)
    qc: {
      required: {
        type: Boolean,
        default: true,
      },
      status: {
        type: String,
        enum: ["pending", "passed", "failed"],
        default: "pending",
      },
      remarks: {
        type: String,
        trim: true,
      },
      checkedAt: Date,
    },

    // 💰 REFUND INFO (if refund)
    refund: {
      amount: {
        type: Number,
        min: 0,
      },
      payment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Payment",
      },
      walletTransaction: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "WalletTransaction",
      },
      refundedAt: Date,
    },

    // 🔁 REPLACEMENT INFO (if replacement)
    replacementOrder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
    },

    // 🧠 POLICY SNAPSHOT
    policy: {
      returnWindowDays: Number,
      isReturnable: Boolean,
    },

    // 🧑‍💼 ADMIN ACTION
    processedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    processedAt: Date,

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
returnSchema.index({ seller: 1, status: 1 });
returnSchema.index({ user: 1, createdAt: -1 });
returnSchema.index({ reason: 1 });

// 🧠 METHODS

// Approve return
returnSchema.methods.approve = function (adminUserId) {
  this.status = "approved";
  this.processedBy = adminUserId;
  this.processedAt = new Date();
  return this.save();
};

// Reject return
returnSchema.methods.reject = function (reason) {
  this.status = "rejected";
  this.notes = reason;
  return this.save();
};

const Return = mongoose.model("Return", returnSchema);

export default Return;
