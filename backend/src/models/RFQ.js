const mongoose = require("mongoose");

const rfqSchema = new mongoose.Schema(
  {
    buyerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true
    },

    requestedQuantity: {
      type: Number,
      required: true
    },

    buyerMessage: {
      type: String
    },

    quotedPrice: {
      type: Number
      // seller fills this
    },

    sellerMessage: {
      type: String
    },

    status: {
      type: String,
      enum: [
        "REQUESTED",   // buyer sent RFQ
        "QUOTED",      // seller replied
        "ACCEPTED",    // buyer accepted
        "REJECTED"     // buyer rejected
      ],
      default: "REQUESTED"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("RFQ", rfqSchema);
