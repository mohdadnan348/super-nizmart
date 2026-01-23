import mongoose from "mongoose";

const hearingSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
      index: true,
    },
    courtRoom: {
      type: String,
      trim: true,
    },
    purpose: {
      type: String, // evidence, argument, order
      trim: true,
    },
    outcome: {
      type: String,
      trim: true,
    },
    nextHearingDate: {
      type: Date,
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  { _id: false }
);

const caseSchema = new mongoose.Schema(
  {
    // 👤 CLIENT
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // ⚖️ ADVOCATE
    advocate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    advocateProfile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AdvocateProfile",
    },

    // 🏛️ CASE BASIC INFO
    caseTitle: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    caseType: {
      type: String,
      enum: [
        "civil",
        "criminal",
        "family",
        "corporate",
        "property",
        "labor",
        "tax",
        "other",
      ],
      required: true,
      index: true,
    },

    caseNumber: {
      type: String,
      trim: true,
      index: true,
      /*
        Court case number / FIR number
      */
    },

    court: {
      name: {
        type: String, // District Court, High Court, Supreme Court
        trim: true,
        index: true,
      },
      city: String,
      state: String,
    },

    filingDate: {
      type: Date,
      index: true,
    },

    // 👥 PARTIES
    parties: {
      petitioner: {
        type: String,
        trim: true,
      },
      respondent: {
        type: String,
        trim: true,
      },
      oppositeCounsel: {
        type: String,
        trim: true,
      },
    },

    // 📄 CASE SUMMARY
    description: {
      type: String,
      trim: true,
    },

    // 🔗 RELATED APPOINTMENT (optional)
    appointment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
      index: true,
    },

    // 📅 HEARINGS
    hearings: [hearingSchema],

    nextHearingDate: {
      type: Date,
      index: true,
    },

    // 💰 FEES / BILLING (optional snapshot)
    billing: {
      feeType: {
        type: String,
        enum: ["fixed", "hourly", "per-hearing"],
      },
      amount: {
        type: Number,
        min: 0,
      },
      currency: {
        type: String,
        default: "INR",
      },
    },

    // 🟢 CASE STATUS
    status: {
      type: String,
      enum: [
        "filed",
        "ongoing",
        "stay",
        "closed",
        "disposed",
      ],
      default: "filed",
      index: true,
    },

    closedAt: {
      type: Date,
    },

    // 📊 STATS
    stats: {
      totalHearings: {
        type: Number,
        default: 0,
      },
    },

    // 🧠 NOTES
    notes: {
      type: String,
      trim: true,
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
caseSchema.index({ advocate: 1, status: 1 });
caseSchema.index({ client: 1, createdAt: -1 });
caseSchema.index({ nextHearingDate: 1 });

// 🧠 METHODS

// Add hearing
caseSchema.methods.addHearing = function (hearing) {
  this.hearings.push(hearing);
  this.stats.totalHearings += 1;
  this.nextHearingDate = hearing.nextHearingDate || null;
  return this.save();
};

// Close case
caseSchema.methods.closeCase = function () {
  this.status = "closed";
  this.closedAt = new Date();
  return this.save();
};

const Case = mongoose.model("Case", caseSchema);

export default Case;
