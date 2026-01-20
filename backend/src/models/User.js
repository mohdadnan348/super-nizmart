const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      lowercase: true,
      trim: true,
      unique: true,
      sparse: true
    },

    phone: {
      type: String,
      required: true,
      unique: true
    },

    password: {
      type: String,
      required: true,
      select: false
    },

    // 🔑 DEFAULT ROLE = CUSTOMER
    role: {
      type: String,
      enum: [
        "ADMIN",
        "CUSTOMER",
        "B2C_SELLER",
        "B2B_SELLER",
        "HOME_SERVICE_PROVIDER"
      ],
      default: "CUSTOMER"
    },

    roleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role"
    },

    isEmailVerified: {
      type: Boolean,
      default: false
    },

    isPhoneVerified: {
      type: Boolean,
      default: false
    },

    status: {
      type: String,
      enum: ["PENDING", "ACTIVE", "SUSPENDED"],
      default: "PENDING"
    },

    lastLoginAt: {
      type: Date
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
