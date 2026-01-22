import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    // 🏷️ BASIC INFO
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    slug: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    description: {
      type: String,
      trim: true,
    },

    // 🔗 SELLER
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // 🗂️ CATEGORY (B2C categories)
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ServiceCategory", // reuse category tree or create ProductCategory later
      required: true,
      index: true,
    },

    brand: {
      type: String,
      trim: true,
      index: true,
    },

    // 🖼️ IMAGES
    images: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Document",
      },
    ],

    // 📦 PRICING (MASTER – variants override)
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

    // 📐 ATTRIBUTES (for variants: size, color, etc.)
    attributes: [
      {
        name: {
          type: String,
          trim: true,
        },
        values: {
          type: [String],
          default: [],
        },
      },
    ],

    // 📦 VARIANTS (SKU-level)
    variants: [
      {
        sku: {
          type: String,
          required: true,
          trim: true,
          index: true,
        },
        attributes: [
          {
            name: String,   // e.g. Size
            value: String,  // e.g. M
          },
        ],
        pricing: {
          mrp: Number,
          sellingPrice: Number,
        },
        stock: {
          type: Number,
          default: 0,
          min: 0,
        },
        images: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Document",
          },
        ],
        isActive: {
          type: Boolean,
          default: true,
        },
      },
    ],

    // 📦 INVENTORY (non-variant products)
    stock: {
      type: Number,
      default: 0,
      min: 0,
    },

    // 🚚 SHIPPING
    shipping: {
      weight: Number, // grams
      dimensions: {
        length: Number,
        width: Number,
        height: Number,
      },
      isFreeShipping: {
        type: Boolean,
        default: false,
      },
    },

    // 🧾 TAX / HSN
    tax: {
      hsn: {
        type: String,
        trim: true,
      },
      gstPercentage: {
        type: Number,
        min: 0,
        max: 28,
        default: 0,
      },
    },

    // ⭐ RATINGS (cached)
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    ratingCount: {
      type: Number,
      default: 0,
    },

    // 🟢 VISIBILITY / APPROVAL
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },

    isApproved: {
      type: Boolean,
      default: false,
      index: true,
    },

    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    approvedAt: {
      type: Date,
    },

    isFeatured: {
      type: Boolean,
      default: false,
      index: true,
    },

    // 🧠 POLICY
    returnPolicyDays: {
      type: Number,
      default: 7,
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
productSchema.index({ seller: 1, isActive: 1 });
productSchema.index({ category: 1, isApproved: 1 });
productSchema.index({ "variants.sku": 1 });

// 🧠 METHODS

// Update rating cache
productSchema.methods.updateRating = function (avgRating, count) {
  this.rating = avgRating;
  this.ratingCount = count;
  return this.save();
};

const Product = mongoose.model("Product", productSchema);

export default Product;
