import mongoose from "mongoose";

const seoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    keywords: [
      {
        type: String,
        trim: true,
      },
    ],
    ogImage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Document",
    },
  },
  { _id: false }
);

const cmsPageSchema = new mongoose.Schema(
  {
    // 🏷️ BASIC INFO
    title: {
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
      unique: true,
      index: true,
      /*
        about-us
        privacy-policy
        terms-and-conditions
      */
    },

    // 📄 CONTENT
    content: {
      type: String, // HTML / Markdown
      required: true,
    },

    // 🌐 PAGE TYPE
    pageType: {
      type: String,
      enum: ["static", "dynamic", "legal", "help"],
      default: "static",
      index: true,
    },

    // 🌍 VISIBILITY
    visibility: {
      type: String,
      enum: ["public", "private"],
      default: "public",
      index: true,
    },

    // 🌐 MULTI-LANGUAGE SUPPORT
    language: {
      type: String,
      default: "en",
      index: true,
      /*
        en, hi, ar, etc.
      */
    },

    // 🔁 VERSIONING
    version: {
      type: Number,
      default: 1,
    },

    previousVersion: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CMSPage",
    },

    // 🧾 SEO
    seo: seoSchema,

    // 🟢 PUBLISHING
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
      index: true,
    },

    publishedAt: {
      type: Date,
    },

    // 👤 AUTHOR / ADMIN
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },

    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    // 🧠 META
    notes: {
      type: String,
      trim: true,
    },

    // 📊 STATS
    stats: {
      views: {
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
cmsPageSchema.index({ slug: 1, language: 1 }, { unique: true });
cmsPageSchema.index({ status: 1, visibility: 1 });
cmsPageSchema.index({ pageType: 1 });

// 🧠 METHODS

// Publish page
cmsPageSchema.methods.publish = function () {
  this.status = "published";
  this.publishedAt = new Date();
  return this.save();
};

// Archive page
cmsPageSchema.methods.archive = function () {
  this.status = "archived";
  return this.save();
};

// Increment view count
cmsPageSchema.methods.incrementViews = function () {
  this.stats.views += 1;
  return this.save();
};

const CMSPage = mongoose.model("CMSPage", cmsPageSchema);

export default CMSPage;
