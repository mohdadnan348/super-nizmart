import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
  {
    // 🔗 OWNER (User / Seller / Provider)
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // 🏷️ ADDRESS TYPE
    type: {
      type: String,
      enum: ["home", "work", "office", "warehouse", "other"],
      default: "home",
      index: true,
    },

    // 🏠 ADDRESS DETAILS
    name: {
      type: String,
      trim: true,
      // Example: "Home", "Shop", "Warehouse"
    },

    addressLine1: {
      type: String,
      required: true,
      trim: true,
    },

    addressLine2: {
      type: String,
      trim: true,
    },

    landmark: {
      type: String,
      trim: true,
    },

    city: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    state: {
      type: String,
      required: true,
      trim: true,
    },

    country: {
      type: String,
      default: "India",
      trim: true,
    },

    pincode: {
      type: String,
      required: true,
      index: true,
    },

    // 📞 CONTACT (optional – delivery ke liye)
    contactName: {
      type: String,
      trim: true,
    },

    contactPhone: {
      type: String,
      trim: true,
    },

    // 🌍 LOCATION (MAP / DELIVERY / NEARBY SEARCH)
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        index: "2dsphere",
      },
    },

    // ⭐ DEFAULT ADDRESS FLAG
    isDefault: {
      type: Boolean,
      default: false,
    },

    // 🟢 STATUS
    isActive: {
      type: Boolean,
      default: true,
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

// 🔍 INDEXES (performance)
addressSchema.index({ user: 1, isDeleted: 1 });
addressSchema.index({ pincode: 1 });

// 🧠 PRE SAVE HOOK
// Ek user ka sirf ek hi default address rahe
addressSchema.pre("save", async function (next) {
  if (this.isDefault) {
    await mongoose.model("Address").updateMany(
      { user: this.user, _id: { $ne: this._id } },
      { $set: { isDefault: false } }
    );
  }
  next();
});

const Address = mongoose.model("Address", addressSchema);

export default Address;
