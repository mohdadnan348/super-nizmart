const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      enum: [
        "ADMIN",
        "CUSTOMER",
        "B2C_SELLER",
        "B2B_SELLER",
        "HOME_SERVICE_PROVIDER"
      ]
    },

    description: {
      type: String,
      trim: true
    },

    permissions: [
      {
        type: String
        // example:
        // "CREATE_PRODUCT"
        // "UPDATE_PRODUCT"
        // "VIEW_ORDERS"
        // "MANAGE_USERS"
      }
    ],

    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Role", roleSchema);
