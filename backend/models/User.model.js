import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    // 🔐 AUTH BASIC
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    phone: {
      type: String,
      unique: true,
      sparse: true, // allow null but unique if exists
      index: true,
    },

    password: {
      type: String,
      required: true,
      select: false, // by default password nahi aayega
    },

    // 👥 ROLE SYSTEM (IMPORTANT)
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
      required: true,
      index: true,
    },

    // 👤 PROFILE LINK
    profile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Profile",
    },

    // 🟢 ACCOUNT STATUS
    isActive: {
      type: Boolean,
      default: true,
    },

    isBlocked: {
      type: Boolean,
      default: false,
    },

    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    isPhoneVerified: {
      type: Boolean,
      default: false,
    },

    // 🔑 LOGIN / SECURITY
    lastLoginAt: {
      type: Date,
    },

    passwordChangedAt: {
      type: Date,
    },

    // 💳 SUBSCRIPTION (Seller / Provider / etc.)
    subscription: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subscription",
    },

    // 💰 WALLET LINK
    wallet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Wallet",
    },

    // 🗑️ SOFT DELETE
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true, // createdAt, updatedAt
  }
);

// 🔍 INDEXES (performance ke liye)
userSchema.index({ email: 1 });
userSchema.index({ phone: 1 });
userSchema.index({ role: 1, isActive: 1 });

// ❌ PASSWORD JSON RESPONSE SE REMOVE
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

const User = mongoose.model("User", userSchema);

export default User;
