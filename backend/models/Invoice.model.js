import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema(
  {
    // 🧾 INVOICE BASIC
    invoiceNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
      /*
        Example:
        INV-2026-000123
      */
    },

    invoiceDate: {
      type: Date,
      default: Date.now,
      index: true,
    },

    // 👤 CUSTOMER
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // 👨‍🔧 PROVIDER / SELLER
    provider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },

    // 🔗 SOURCE (one of them)
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      index: true,
    },

    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      index: true,
    },

    // 📦 BILLING DETAILS
    items: [
      {
        name: {
          type: String,
          required: true,
          trim: true,
        },
        description: {
          type: String,
          trim: true,
        },
        quantity: {
          type: Number,
          default: 1,
          min: 1,
        },
        unitPrice: {
          type: Number,
          required: true,
          min: 0,
        },
        totalPrice: {
          type: Number,
          required: true,
          min: 0,
        },
      },
    ],

    // 💰 AMOUNTS
    amounts: {
      subTotal: {
        type: Number,
        required: true,
        min: 0,
      },
      discount: {
        type: Number,
        default: 0,
        min: 0,
      },
      tax: {
        cgst: {
          type: Number,
          default: 0,
        },
        sgst: {
          type: Number,
          default: 0,
        },
        igst: {
          type: Number,
          default: 0,
        },
      },
      totalTax: {
        type: Number,
        default: 0,
      },
      grandTotal: {
        type: Number,
        required: true,
        min: 0,
      },
      currency: {
        type: String,
        default: "INR",
      },
    },

    // 🏢 SELLER / PROVIDER GST INFO
    sellerDetails: {
      name: String,
      gstin: String,
      address: String,
    },

    // 👤 CUSTOMER BILLING ADDRESS
    billingAddress: {
      name: String,
      phone: String,
      addressLine: String,
      city: String,
      state: String,
      pincode: String,
      country: {
        type: String,
        default: "India",
      },
    },

    // 💳 PAYMENT LINK
    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
      index: true,
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "paid",
      index: true,
