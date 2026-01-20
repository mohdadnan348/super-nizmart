const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    productType: {
      type: String,
      enum: ["B2C", "B2B"],
      required: true
    },

    name: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String
    },

    images: [
      {
        type: String
      }
    ],

    price: {
      type: Number,
      required: true
    },

    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true
    },

    status: {
      type: String,
      enum: ["DRAFT", "ACTIVE", "INACTIVE"],
      default: "DRAFT"
    },

    // 🔹 B2C ONLY
    stock: {
      type: Number,
      default: 0
    },

    // 🔹 B2B ONLY
    moq: {
      type: Number,
      default: 1
    },

    isApproved: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

/**
 * 🔐 VALIDATION LOGIC
 */
productSchema.pre("save", function (next) {
  if (this.productType === "B2C" && this.stock <= 0) {
    return next(new Error("Stock is required for B2C product"));
  }

  if (this.productType === "B2B" && this.moq <= 0) {
    return next(new Error("MOQ is required for B2B product"));
  }

  next();
});

module.exports = mongoose.model("Product", productSchema);
