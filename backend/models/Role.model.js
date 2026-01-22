import mongoose from "mongoose";

const roleSchema = new mongoose.Schema(
  {
    // 🔑 ROLE BASIC INFO
    name: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
      /*
        Examples:
        admin
        customer
        service-provider
        seller-b2c
        seller-b2b
        restaurant
        doctor
        advocate
        hotel
        driver
        bike-owner
        cinema-owner
        property-owner
      */
    },

    displayName: {
      type: String,
      required: true,
      trim: true,
      // Example: "Service Provider", "B2C Seller"
    },

    description: {
      type: String,
      trim: true,
    },

    // 🔐 PERMISSIONS (RBAC CORE)
    permissions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Permission",
      },
    ],

    // 🟢 STATUS FLAGS
    isActive: {
      type: Boolean,
      default: true,
    },

    isSystemRole: {
      type: Boolean,
      default: false,
      /*
        true  → admin, customer (default roles)
        false → future custom roles
      */
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

// 🔍 INDEXES (performance)
roleSchema.index({ name: 1 });
roleSchema.index({ isActive: 1 });

// 🧠 VIRTUAL (OPTIONAL)
// Kitne users is role ko use kar rahe hain
roleSchema.virtual("userCount", {
  ref: "User",
  localField: "_id",
  foreignField: "role",
  count: true,
});

const Role = mongoose.model("Role", roleSchema);

export default Role;
