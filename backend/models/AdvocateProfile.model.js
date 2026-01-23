import mongoose from "mongoose";

const advocateProfileSchema = new mongoose.Schema(
  {
    // 🔗 USER (Advocate)
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },

    // ⚖️ BASIC INFO
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

    // ⚖️ PRACTICE AREAS
    practiceAreas: [
      {
        type: String,
        trim: true,
        index: true,
        /*
          Examples:
          Criminal, Civil, Family, Corporate, Property
        */
      },
    ],

    // 🏛️ COURTS
    courts: [
      {
        name: {
          type: String, // District Court, High Court, Supreme Court
          trim: true,
          index: true,
        },
        city: String,
        state: String,
      },
    ],

    // 🎓 QUALIFICATIONS
    qualifications: [
      {
        degree: String, // LLB, LLM
        institute: String,
        year: Number,
      },
    ],

    // 🧾 BAR REGISTRATION
    registration: {
      council: {
        type: String, // Bar Council of India / State Bar
        trim: true,
      },
      enrollmentNumber: {
        type: String,
        index: true,
      },
      year: Number,
    },

    // 🧑‍💼 CONSULTATION MODES
    consultationModes: {
      chamber: {
        type: Boolean,
        default: true,
      },
      online: {
        type: Boolean,
        default: false,
      },
      phone: {
        type: Boolean,
        default: false,
      },
    },

    // 💰 FEES
    fees: {
      chamber: {
        type: Number,
        min: 0,
      },
      online: {
        type: Number,
        min: 0,
      },
      phone: {
        type: Number,
        min: 0,
      },
      currency: {
        type: String,
        default: "INR",
      },
    },

    // ⏰ AVAILABILITY
    availability: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Availability",
    },

    // 🏢 CHAMBER / OFFICE
    office: {
      name: String,
      address: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Address",
      },
      timings: {
        startTime: String,
        endTime: String,
      },
    },

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
      totalCases: {
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
advocateProfileSchema.index({ fullName: 1, isActive: 1 });
advocateProfileSchema.index({ practiceAreas: 1, experienceYears: -1 });
advocateProfileSchema.index({ "verification.isVerified": 1 });

// 🧠 METHODS

// Update rating cache
advocateProfileSchema.methods.updateRating = function (avg, count) {
  this.rating = avg;
  this.ratingCount = count;
  return this.save();
};

const AdvocateProfile = mongoose.model(
  "AdvocateProfile",
  advocateProfileSchema
);

export default AdvocateProfile;
