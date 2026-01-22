import mongoose from "mongoose";

const serviceCategorySchema = new mongoose.Schema(
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
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    description: {
      type: String,
      trim: true,
    },

    // 🧱 HIERARCHY (Parent → Child)
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ServiceCategory",
      index: true,
      default: null, // null = top-level category
    },

    level: {
      type: Number,
      default: 0, // 0 = parent, 1 = child, 2 = sub-child
      index: true,
    },

    // 🖼️ ICON / IMAGE
    icon: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Document",
    },

    banner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Document",
    },

    // 🎯 SERVICE TYPE (filtering / analytics)
    serviceType: {
      type: String,
      enum: [
        "home-service",
        "professional",
        "health",
        "legal",
        "repair",
        "cleaning",
        "other",
      ],
      default: "other",
      index: true,
    },

    // 🟢 VISIBILITY / STATUS
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },

    isFeatured: {
      type: Boolean,
      default: false,
      index: true,
    },

    sortOrder: {
      type: Number,
      default: 0,
      index: true,
    },

    // 📊 COUNTERS (performance)
    serviceCount: {
      type: Number,
      default: 0,
    },

    // 🔍 SEO
    seo: {
      title: {
        type: String,
        trim: true,
      },
      description: {
        type: String,
        trim: true,
      },
      keywords: {
        type: [String],
        default: [],
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
serviceCategorySchema.index({ parent: 1, isActive: 1 });
serviceCategorySchema.index({ serviceType: 1, sortOrder: 1 });

// 🧠 VIRTUALS

// Child categories
serviceCategorySchema.virtual("children", {
  ref: "ServiceCategory",
  localField: "_id",
  foreignField: "parent",
});

// 🧠 METHODS

// Increase service count
serviceCategorySchema.methods.incrementServiceCount = function () {
  this.serviceCount += 1;
  return this.save();
};

const ServiceCategory = mongoose.model(
  "ServiceCategory",
  serviceCategorySchema
);

export default ServiceCategory;
