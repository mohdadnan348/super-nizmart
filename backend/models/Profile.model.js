import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
  {
    // 🔗 USER LINK
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },

    // 👤 BASIC INFO
    firstName: {
      type: String,
      trim: true,
    },

    lastName: {
      type: String,
      trim: true,
    },

    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },

    dob: {
      type: Date,
    },

    avatar: {
      type: String, // cloudinary / s3 url
    },

    // 📞 CONTACT
    alternatePhone: {
      type: String,
    },

    // 📍 ADDRESS (DEFAULT)
    address: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
    },

    // 🌍 LOCATION (MAP SUPPORT)
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
      },
    },

    // 🧾 ID / DOCUMENTS (KYC READY)
    documents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Document",
      },
    ],

    // ⭐ RATINGS (SERVICE PROVIDER / SELLER)
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    ratingCount: {
      type: Number,
      default: 0,
    },

    // 🧠 BIO / ABOUT
    bio: {
      type: String,
      trim: true,
    },

    // 🟢 STATUS
    isCompleted: {
      type: Boolean,
      default: false, // profile completion flag
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

// 🌍 GEO INDEX (maps / nearby search)
profileSchema.index({ location: "2dsphere" });

// 🧠 VIRTUAL: FULL NAME
profileSchema.virtual("fullName").get(function () {
  return `${this.firstName || ""} ${this.lastName || ""}`.trim();
});

const Profile = mongoose.model("Profile", profileSchema);

export default Profile;
