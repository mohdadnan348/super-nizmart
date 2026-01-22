import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    // 👤 REVIEW BY (Customer)
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // 👤 REVIEW FOR (Seller / Provider / Owner)
    targetUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // 🔗 SOURCE (one of them)
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      index: true,
    },

    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      index: true,
    },

    // 🧩 SERVICE TYPE
    serviceType: {
      type: String,
      enum: [
        "b2c",
        "b2b",
        "service",
        "restaurant",
        "hotel",
        "doctor",
        "advocate",
        "driver",
        "bike",
        "cinema",
        "property",
      ],
      required: true,
      index: true,
    },

    // ⭐ RATING
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
      index: true,
    },

    // 📝 REVIEW TEXT
    comment: {
      type: String,
      trim: true,
      maxlength: 1000,
    },

    // 👍👎 FEEDBACK
    likes: {
      type: Number,
      default: 0,
    },

    dislikes: {
      type: Number,
      default: 0,
    },

    // 💬 PROVIDER RESPONSE (optional)
    reply: {
      message: {
        type: String,
        trim: true,
      },
      repliedAt: {
        type: Date,
      },
    },

    // 🟢 STATUS / MODERATION
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "approved",
      index: true,
    },

    rejectedReason: {
      type: String,
      trim: true,
    },

    // 🚩 REPORT / FLAG
    isReported: {
      type: Boolean,
      default: false,
      index: true,
    },

    reportedReason: {
      type: String,
      trim: true,
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

// 🔍 INDEXES (performance & analytics)
reviewSchema.index({ targetUser: 1, rating: -1 });
reviewSchema.index({ serviceType: 1, createdAt: -1 });
reviewSchema.index({ status: 1 });

// 🧠 STATIC: UPDATE AVERAGE RATING
reviewSchema.statics.calculateAverageRating = async function (targetUserId) {
  const result = await this.aggregate([
    {
      $match: {
        targetUser: new mongoose.Types.ObjectId(targetUserId),
        status: "approved",
        isDeleted: false,
      },
    },
    {
      $group: {
        _id: "$targetUser",
        avgRating: { $avg: "$rating" },
        count: { $sum: 1 },
      },
    },
  ]);

  return result.length
    ? { rating: result[0].avgRating, count: result[0].count }
    : { rating: 0, count: 0 };
};

const Review = mongoose.model("Review", reviewSchema);

export default Review;
