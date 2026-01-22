import mongoose from "mongoose";

const productVariantSchema = new mongoose.Schema(
  {
    // 🔗 PRODUCT LINK
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true,
    },

    // 👤 SELLER (fast queries / safety)
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // 🆔 SKU (unique per variant)
    sku: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },

    // 📐 ATTRIBUTES (Size, Color, etc.)
    attributes: [
      {
        name: {
          type: String,
          required: true,
          trim: true,
        },
        value: {
          type: String,
          required: true,
          trim: true,
        },
      },
    ],

    // 💰 PRICING
    pricing: {
      mrp: {
        type: Number,
        required: true,
        min: 0,
      },
      sellingPrice: {
        type: Number,
        required: true,
        min: 0,
      },
      currency: {
        type: String,
        default: "INR",
      },
      taxIncluded: {
        type: Boolean,
        default: true,
      },
    },

    // 📦 INVENTORY
    stock: {
      type: Number,
      default: 0,
      min: 0,
      index: true,
    },

    lowStockThreshold: {
      type: Number,
      default: 5,
    },

    // 🖼️ IMAGES (variant-specific)
    images: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Document",
      },
    ],

    // 🚚 SHIPPING (override product level)
    shipping: {
      weight: Number, // grams
      dimensions: {
        length: Number,
        width: Number,
        height: Number,
      },
    },

    // 🟢 STATUS
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },

    isDefault: {
      type: Boolean,
      default: false,
    },

    // 🧾 TAX (override if needed)
    tax: {
      hsn: {
        type: String,
        trim: true,
      },
      gstPercentage: {
        type: Number,
        min: 0,
        max: 28,
      },
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
productVariantSchema.index({ product: 1, isActive: 1 });
productVariantSchema.index({ seller: 1, stock: 1 });

// 🧠 HOOK: Ensure single default variant per product
productVariantSchema.pre("save", async function (next) {
  if (this.isDefault) {
    await mongoose.model("ProductVariant").updateMany(
      { product: this.product, _id: { $ne: this._id } },
      { $set: { isDefault: false } }
    );
  }
  next();
});

// 🧠 METHODS

// Reduce stock
productVariantSchema.methods.decreaseStock = function (qty) {
  if (this.stock < qty) {
    throw new Error("Insufficient stock for variant");
  }
  this.stock -= qty;
  return this.save();
};

// Increase stock
productVariantSchema.methods.increaseStock = function (qty) {
  this.stock += qty;
  return this.save();
};

const ProductVariant = mongoose.model(
  "ProductVariant",
  productVariantSchema
);

export default ProductVariant;
