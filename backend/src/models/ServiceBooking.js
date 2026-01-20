const mongoose = require("mongoose");

const serviceBookingSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    providerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "HomeService",
      required: true
    },

    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true
    },

    bookingDate: {
      type: Date,
      required: true
    },

    timeSlot: {
      type: String,
      required: true
      // example: "10:00-12:00"
    },

    addressId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
      required: true
    },

    price: {
      type: Number,
      required: true
    },

    status: {
      type: String,
      enum: [
        "PENDING",     // customer booked, provider not accepted
        "ACCEPTED",    // provider accepted
        "REJECTED",    // provider rejected
        "COMPLETED",   // service completed
        "CANCELLED"    // cancelled by customer/admin
      ],
      default: "PENDING"
    },

    paymentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "ServiceBooking",
  serviceBookingSchema
);
