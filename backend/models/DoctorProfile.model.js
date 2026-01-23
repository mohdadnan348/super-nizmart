import mongoose from "mongoose";

const doctorProfileSchema = new mongoose.Schema(
  {
    // 🔗 USER (Doctor)
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },

    // 🏥 BASIC INFO
    fullName: {
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
      index: true,
    },

    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },

    experienceYears: {
      type: Number,
      min: 0,
      index: true,
    },

    about: {
      type: String,
      trim: true,
    },

    // 🩺 SPECIALIZATIONS
    specializations: [
      {
        type: String,
        trim: true,
        index: true,
      },
    ],

    qualifications: [
      {
        degree: String,      // MBBS, MD
        institute: String,
        year: Number,
      },
    ],

    registrations: [
      {
        council: String,     // MCI / State Council
        registrationNumber: {
          type: String,
          index: true,
        },
        year: Number,
      },
    ],

    // 🏥 PRACTICE MODES
    consultationModes: {
      clinic: {
        type: Boolean,
        default: true,
      },
      online: {
        type: Boolean,
        default: false,
      },
      homeVisit: {
        type: Boolean,
        default: false,
      },
    },

    // 💰 FEES
    fees: {
      clinic: {
        type: Number,
        min: 0,
      },
      online: {
        type: Number,
        min: 0,
      },
      homeVisit: {
        type: Number,
        min: 0,
      },
      currency: {
        type: String,
        default: "INR",
      },
    },

    // ⏰ AVAILABILITY (link to Availability.model.js)
    availability: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Availability",
    },

    // 🏥 CLINICS / HOSPITALS
    clinics: [
      {
        name: String,
        address: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Address",
        },
        consultationFee: Number,
        timings: {
          startTime: String,
          endTime: String,
        },
      },
    ],

    // 🖼️ MEDIA
    profilePhoto: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Document",
    },

    certificates: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Document",
      },
    ],

    // ⭐ RATINGS
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

    // 🟢 VERIFICATION
    verification: {
      isVerified: {
        type: Boolean,
        default: false,
        index: true,
      },
      verifiedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      verifiedAt: Date,
      rejectedReason: {
        type: String,
        trim: true,
      },
    },

    // 🟢 STATUS
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },

    isFeatured: {
      type: Boolean,
      default: false,
      index: true,
    },

    // 📊 STATS
    stats: {
      totalAppointments: {
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
doctorProfileSchema.index({ fullName: 1, isActive: 1 });
doctorProfileSchema.index({ "verification.isVerified": 1 });
doctorProfileSchema.index({ specializations: 1, experienceYears: -1 });

// 🧠 METHODS

// Update rating cache
doctorProfileSchema.methods.updateRating = function (avg, count) {
  this.rating = avg;
  this.ratingCount = count;
  return this.save();
};

const DoctorProfile = mongoose.model(
  "DoctorProfile",
  doctorProfileSchema
);

export default DoctorProfile;
