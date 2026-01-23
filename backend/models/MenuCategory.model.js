import mongoose from "mongoose";

const menuCategorySchema = new mongoose.Schema(
  {
    // 🔗 RESTAURANT LINK
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
      index: true,
    },

    // 🏷️ BASIC INFO
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
      /*
        Examples:
        Starters, Main Course, Biryani, Desserts
      */
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

    // 🌱 FOOD TYPE FILTER
    foodType: {
      type: String,
      enum: ["veg", "non-veg", "egg", "mixed"],
      default: "mixed",
      index: true,
    },

    // 🖼️ IMAGE / ICON
    image: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Document",
    },

    // 🔢 DISPLAY ORDER
    sortOrder: {
      type: Number,
      default: 0,
      index: true,
    },

    // 🟢 VISIBILITY
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },

    // 🧠 TIMING (category-level availability)
    availability: {
      isTimeRestricted: {
        type: Boolean,
        default: false,
      },
      startTime: {
        type: String, // "11:00"
      },
      endTime: {
        type: String, // "16:00"
      },
    },

    // 📊 STATS (optional)
    itemCount: {
      type: Number,
      default: 0,
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
menuCategorySchema.index({ restaurant: 1, sortOrder: 1 });
menuCategorySchema.index({ restaurant: 1, isActive: 1 });

// 🧠 METHODS

// Increment item count
menuCategorySchema.methods.incrementItemCount = function () {
  this.itemCount += 1;
  return this.save();
};

const MenuCategory = mongoose.model(
  "MenuCategory",
  menuCategorySchema
);

export default MenuCategory;
