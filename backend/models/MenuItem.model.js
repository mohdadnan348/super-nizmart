import mongoose from "mongoose";

const menuItemSchema = new mongoose.Schema(
  {
    // 🔗 RESTAURANT & CATEGORY
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
      index: true,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MenuCategory",
      required: true,
      index: true,
    },

    // 🍽️ BASIC INFO
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

    // 🌱 FOOD TYPE
    foodType: {
      type: String,
      enum: ["veg", "non-veg", "egg"],
      required: true,
      index: true,
    },

    // 🌶️ EXTRA TAGS
    tags: {
      isSpicy: {
        type: Boolean,
        default: false,
      },
      isSweet: {
        type: Boolean,
        default: false,
      },
      isPopular: {
        type: Boolean,
        default: false,
        index: true,
      },
      isChefSpecial: {
        type: Boolean,
        default: false,
      },
    },

    // 💰 BASE PRICE
    basePrice: {
      type: Number,
      required: true,
      min: 0,
    },

    currency: {
      type: String,
      default: "INR",
    },

    // 🍽️ VARIANTS (Half / Full / Combo)
    variants: [
      {
        name: {
          type: String, // Half / Full
          required: true,
        },
        price: {
          type: Number,
          required: true,
          min: 0,
        },
        isDefault: {
          type: Boolean,
          default: false,
        },
      },
    ],

    // ➕ ADDONS (Extra cheese, toppings)
    addons: [
      {
        name: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true,
          min: 0,
        },
        isActive: {
          type: Boolean,
          default: true,
        },
      },
    ],

    // ⏰ AVAILABILITY (item-level)
    availability: {
      isAvailable: {
        type: Boolean,
        default: true,
        index: true,
      },
      startTime: {
        type: String, // "11:00"
      },
      endTime: {
        type: String, // "23:00"
      },
    },

    // 🖼️ IMAGES
    image: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Document",
    },

    gallery: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Document",
      },
    ],

    // ⭐ RATINGS
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

    // 🟢 STATUS
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },

    isRecommended: {
      type: Boolean,
      default: false,
      index: true,
    },

    // 📊 STATS
    stats: {
      orderedCount: {
        type: Number,
        default: 0,
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
menuItemSchema.index({ restaurant: 1, category: 1, isActive: 1 });
menuItemSchema.index({ foodType: 1, "tags.isPopular": 1 });

// 🧠 METHODS

// Increment order count
menuItemSchema.methods.incrementOrderedCount = function () {
  this.stats.orderedCount += 1;
  return this.save();
};

const MenuItem = mongoose.model("MenuItem", menuItemSchema);

export default MenuItem;
