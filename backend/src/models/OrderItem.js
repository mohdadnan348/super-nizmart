const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true
    },

    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true
    },

    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    quantity: {
      type: Number,
      required: true
    },

    price: {
      type: Number,
      required: true
      // snapshot price
    },

    totalPrice: {
      type: Number,
      required: true
    },

    orderType: {
      type: String,
      enum: ["B2C", "B2B"],
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("OrderItem", orderItemSchema);
