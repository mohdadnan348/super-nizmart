import mongoose from "mongoose";

const supportTicketSchema = new mongoose.Schema(
  {
    // 👤 CREATED BY (Customer / Seller / Provider)
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // 🧑‍💼 ASSIGNED TO (Admin / Support Agent)
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },

    // 🧩 ROLE (jis panel se ticket aaya)
    role: {
      type: String,
      enum: [
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
      required: true,
      index: true,
    },

    // 🏷️ CATEGORY / TYPE
    category: {
      type: String,
      enum: [
        "general",
        "order",
        "booking",
        "payment",
        "wallet",
        "subscription",
        "technical",
        "other",
      ],
      default: "general",
      index: true,
    },

    // 🔗 RELATED ENTITIES (optional)
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      index: true,
    },

    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      index: true,
    },

    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
      index: true,
    },

    // 🧾 SUBJECT & DESCRIPTION
    subject: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    // 📎 ATTACHMENTS (screenshots / docs)
    attachments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Document",
      },
    ],

    // 💬 CONVERSATION / MESSAGES
    messages: [
      {
        sender: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        message: {
          type: String,
          required: true,
          trim: true,
        },
        attachments: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Document",
          },
        ],
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    // 🟢 STATUS FLOW
    status: {
      type: String,
      enum: ["open", "in-progress", "waiting", "resolved", "closed"],
      default: "open",
      index: true,
    },

    // 🚦 PRIORITY / SLA
    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
      index: true,
    },

    // ⏱️ SLA / TIMESTAMPS
    firstResponseAt: {
      type: Date,
    },

    resolvedAt: {
      type: Date,
    },

    closedAt: {
      type: Date,
    },

    // 🟢 FEEDBACK (after close)
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },

    feedback: {
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

// 🔍 INDEXES (performance & admin filters)
supportTicketSchema.index({ status: 1, priority: 1 });
supportTicketSchema.index({ role: 1, createdAt: -1 });
supportTicketSchema.index({ assignedTo: 1, status: 1 });

// 🧠 METHODS

// Add message to ticket
supportTicketSchema.methods.addMessage = function ({
  sender,
  message,
  attachments = [],
}) {
  this.messages.push({ sender, message, attachments });
  if (!this.firstResponseAt) {
    this.firstResponseAt = new Date();
  }
  return this.save();
};

const SupportTicket = mongoose.model(
  "SupportTicket",
  supportTicketSchema
);

export default SupportTicket;
