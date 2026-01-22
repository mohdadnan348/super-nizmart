import mongoose from "mongoose";

const businessInquirySchema = new mongoose.Schema(
  {
    // 👤 INQUIRY BY (Buyer / Visitor)
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
      /*
        optional:
        guest inquiry bhi ho sakti hai
      */
    },

    // 🏢 TARGET BUSINESS (Seller)
    businessProfile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BusinessProfile",
      required: true,
      index: true,
    },

    // 👤 SELLER (fast access)
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // 🔗 RELATED ENTITY (optional)
    bulkProduct: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BulkProduct",
      index: true,
    },

    tradeLead: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TradeLead",
      index: true,
    },

    rfq: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RFQ",
      index: true,
    },

    // 🧾 INQUIRY DETAILS
    subject: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },

    // 📞 CONTACT INFO (guest / override)
    contact: {
      name: {
        type: String,
        trim: true,
      },
      phone: {
        type: String,
        trim: true,
      },
      email: {
        type: String,
        trim: true,
        lowercase: true,
      },
    },

    // 📦 REQUIREMENT (optional quick info)
    quantity: {
      value: Number,
      unit: {
        type: String,
        default: "pcs",
      },
    },

    expectedBudget: {
      min: Number,
      max: Number,
      currency: {
        type: String,
        default: "INR",
      },
    },

    // 📎 ATTACHMENTS
    attachments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Document",
      },
    ],

    // 🟢 STATUS
    status: {
      type: String,
      enum: ["new", "responded", "converted", "closed"],
      default: "new",
      index: true,
    },

    respondedAt: {
      type: Date,
    },

    // 🧑‍💼 RESPONSE (seller reply summary)
    response: {
      message: {
        type: String,
        trim: true,
      },
      repliedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      repliedAt: {
        type: Date,
      },
    },

    // 📊 META / ANALYTICS
    source: {
      type: String,
      enum: ["profile", "product", "rfq", "trade-lead", "other"],
      default: "profile",
      index: true,
    },

    // 🟢 FLAGS
    isRead: {
      type: Boolean,
      default: false,
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
businessInquirySchema.index({ seller: 1, status: 1 });
businessInquirySchema.index({ businessProfile: 1, createdAt: -1 });
businessInquirySchema.index({ source: 1, status: 1 });

// 🧠 METHODS

// Mark inquiry as read
businessInquirySchema.methods.markRead = function () {
  this.isRead = true;
  return this.save();
};

// Respond to inquiry
businessInquirySchema.methods.respond = function ({
  message,
  repliedBy,
}) {
  this.status = "responded";
  this.response = {
    message,
    repliedBy,
    repliedAt: new Date(),
  };
  this.respondedAt = new Date();
  return this.save();
};

const BusinessInquiry = mongoose.model(
  "BusinessInquiry",
  businessInquirySchema
);

export default BusinessInquiry;
