import mongoose from "mongoose";

const otpSchema = new mongoose.Schema(
  {
    // 🔗 USER LINK (optional – guest OTP bhi ho sakta hai)
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },

    // 📞📧 TARGET (email ya phone)
    target: {
      type: String,
      required: true,
      trim: true,
      index: true,
      /*
        Example:
        email -> test@gmail.com
        phone -> 9876543210
      */
    },

    // 🔢 OTP VALUE (hashed recommended)
    otp: {
      type: String,
      required: true,
      select: false, // response me kabhi na jaye
    },

    // 🧩 PURPOSE (VERY IMPORTANT)
    purpose: {
      type: String,
      enum: [
        "register",
        "login",
        "forgot-password",
        "verify-email",
        "verify-phone",
        "2fa",
      ],
      required: true,
      index: true,
    },

    // ⏱️ EXPIRY
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 }, // TTL index (auto delete)
    },

    // 🔄 ATTEMPTS CONTROL
    attempts: {
      type: Number,
      default: 0,
    },

    maxAttempts: {
      type: Number,
      default: 5,
    },

    // 🟢 STATUS
    isUsed: {
      type: Boolean,
      default: false,
      index: true,
    },

    // 🌐 META (security / analytics)
    ipAddress: {
      type: String,
    },

    userAgent: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// 🔍 INDEXES
otpSchema.index({ target: 1, purpose: 1 });
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// 🧠 METHODS

// Check expiry
otpSchema.methods.isExpired = function () {
  return this.expiresAt < new Date();
};

// Increment attempts
otpSchema.methods.incrementAttempts = function () {
  this.attempts += 1;
  return this.save();
};

const OTP = mongoose.model("OTP", otpSchema);

export default OTP;
