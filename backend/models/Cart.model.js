import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    productVariant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductVariant",
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    // 💰 PRICE SNAPSHOT (cart time)
    pricing: {
      mrp: {
        type: Number,
        required: true,
      },
      sellingPrice: {
        type: Number,
        required: true,
      },
      currency: {
        type: String,
        default: "INR",
      },
    },
  },
  { _id: false }
);

const cartSchema = new mongoose.Schema(
  {
    // 👤 CUSTOMER
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // one active cart per user
      index: true,
    },

    // 🛒 ITEMS
    items: [cartItemSchema],

    // 🏷️ COUPON
    coupon: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Coupon",
    },

    discountAmount: {
      type: Number,
      default: 0,
    },

    // 💰 TOTALS
    totals: {
      subTotal: {
        type: Number,
        default: 0,
      },
      tax: {
        type: Number,
        default: 0,
      },
      grandTotal: {
        type: Number,
        default: 0,
      },
      currency: {
        type: String,
        default: "INR",
      },
    },

    // 🟢 STATUS
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },

    lastUpdatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// 🔍 INDEXES
cartSchema.index({ user: 1, isActive: 1 });

// 🧠 METHODS

// Recalculate totals
cartSchema.methods.calculateTotals = function () {
  let subTotal = 0;

  this.items.forEach((item) => {
    subTotal += item.pricing.sellingPrice * item.quantity;
  });

  this.totals.subTotal = subTotal;
  this.totals.grandTotal = subTotal - this.discountAmount;
  this.lastUpdatedAt = new Date();

  return this.save();
};

const Cart = mongoose.model("Cart", cartSchema);

export default Cart;
