import mongoose from "mongoose";

const documentSchema = new mongoose.Schema(
  {
    // 👤 OWNER (jisne upload kiya)
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // 🧩 ROLE (context ke liye)
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

    // 📄 DOCUMENT TYPE
    type: {
      type: String,
      enum: [
        "profile-image",
        "identity-proof",
        "address-proof",
        "license",
        "certificate",
        "invoice",
        "product-image",
        "menu-image",
        "property-image",
        "ticket-attachment",
        "other",
      ],
      default: "other",
      index: true,
    },

    // 🏷️ FILE META
    fileName: {
      type: String,
      required: true,
      trim: true,
    },

    originalName: {
      type: String,
      trim: true,
    },

    mimeType: {
      type: String,
      required: true,
      index: true,
    },

    size: {
      type: Number, // bytes
      required: true,
    },

    // ☁️ STORAGE INFO
    storage: {
      provider: {
        type: String,
        enum: ["local", "cloudinary", "s3"],
        default: "cloudinary",
      },
      url: {
        type: String,
        required: true,
      },
      publicId: {
        type: String, // cloudinary public_id
      },
      bucket: {
        type: String, // s3 bucket
      },
      key: {
        type: String, // s3 key / local path
      },
    },

    // 🔗 LINKED ENTITY (optional)
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
    },

    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
    },

    ticket: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SupportTicket",
    },

    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },

    // 🟢 VERIFICATION (KYC / Admin approval)
    verification: {
      isVerified: {
        type: Boolean,
        default: false,
        index: true,
      },
      verifiedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      verifiedAt: {
        type: Date,
      },
      rejectedReason: {
        type: String,
        trim: true,
      },
    },

    // 🟢 STATUS
    isActive: {
      type: Boolean,
      default: true,
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
documentSchema.index({ user: 1, type: 1 });
documentSchema.index({ type: 1, createdAt: -1 });
documentSchema.index({ "verification.isVerified": 1 });

// 🧠 METHODS

// Mark document verified
documentSchema.methods.verify = function (adminUserId) {
  this.verification.isVerified = true;
  this.verification.verifiedBy = adminUserId;
  this.verification.verifiedAt = new Date();
  return this.save();
};

// Reject document
documentSchema.methods.reject = function (reason) {
  this.verification.isVerified = false;
  this.verification.rejectedReason = reason;
  return this.save();
};

const Document = mongoose.model("Document", documentSchema);

export default Document;
