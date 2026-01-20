const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    targetType: {
      type: String,
      enum: ["PRODUCT", "SERVICE"],
      required: true
    },

    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
      // Product._id OR HomeService._id
    },

    referenceType: {
      type: String,
      enum: ["ORDER", "SERVICE_BOOKING"],
      required: true
    },

    referenceId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
      // Order._id OR ServiceBooking._id
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },

    comment: {
      type: String,
      trim: true
    },

    isApproved: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Review", reviewSchema);
