import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    // 🔗 USER LINK
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // 🔑 TOKENS
    accessToken: {
      type: String,
      required: true,
      select: false, // response me expose na ho
    },

    refreshToken: {
      type: String,
      required: true,
      select: false,
      index: true,
    },

    // 📱 DEVICE / CLIENT INFO
    deviceType: {
      type: String,
      enum: ["web", "android", "ios", "other"],
      default: "web",
      index: true,
    },

    deviceId: {
      type: String,
      index: true,
      /*
        browser fingerprint / mobile device id
      */
    },

    ipAddress: {
      type: String,
      index: true,
    },

    userAgent: {
      type: String,
    },

    // ⏱️ EXPIRY
    accessTokenExpiresAt: {
      type: Date,
      required: true,
    },

    refreshTokenExpiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 }, // TTL index → auto delete session
    },

    // 🟢 STATUS
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },

    isRevoked: {
      type: Boolean,
      default: false,
      index: true,
    },

    revokedAt: {
      type: Date,
    },

    // 🔁 ROTATION SUPPORT
    replacedByToken: {
      type: String,
      select: false,
    },
  },
  {
    timestamps: true, // createdAt, updatedAt
  }
);

// 🔍 INDEXES (performance + cleanup)
sessionSchema.index({ user: 1, isActive: 1 });
sessionSchema.index({ refreshTokenExpiresAt: 1 }, { expireAfterSeconds: 0 });

// 🧠 METHODS

// Check if refresh token expired
sessionSchema.methods.isRefreshExpired = function () {
  return this.refreshTokenExpiresAt < new Date();
};

// Revoke session
sessionSchema.methods.revoke = function (reason = "manual") {
  this.isRevoked = true;
  this.isActive = false;
  this.revokedAt = new Date();
  return this.save();
};

const Session = mongoose.model("Session", sessionSchema);

export default Session;
