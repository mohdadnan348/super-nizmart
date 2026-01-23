import mongoose from "mongoose";

const tenantSchema = new mongoose.Schema(
  {
    // 👤 TENANT USER
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // 🏠 PROPERTY
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      required: true,
      index: true,
    },

    // 👤 OWNER / LANDLORD
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // 📄 RELATED AGREEMENT
    rentAgreement: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RentAgreement",
      index: true,
    },

    // 📅 TENANCY PERIOD
    tenancy: {
      startDate: {
        type: Date,
        required: true,
        index: true,
      },
      endDate: {
        type: Date,
        index: true,
      },
    },

    // 👥 OCCUPANCY
    occupants: {
      adults: {
        type: Number,
        default: 1,
        min: 1,
      },
      children: {
        type: Number,
        default: 0,
      },
    },

    // 🧾 DOCUMENTS (KYC)
    documents: {
      idProof: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Document",
      },
      addressProof: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Document",
      },
      policeVerification: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Document",
      },
    },

    // 💰 RENT DETAILS (snapshot)
    rent: {
      monthlyRent: {
        type: Number,
        required: true,
        min: 0,
      },
      maintenance: {
        type: Number,
        default: 0,
      },
      securityDeposit: {
        type: Number,
        default: 0,
      },
      dueDayOfMonth: {
        type: Number,
        default: 5,
        min: 1,
        max: 31,
      },
      currency: {
        type: String,
        default: "INR",
      },
    },

    // 🟢 STATUS
    status: {
      type: String,
      enum: ["active", "vacated", "terminated"],
      default: "active",
      index: true,
    },

    vacatedAt: {
      type: Date,
    },

    // 🧠 META
    notes: {
      type: String,
      trim: true,
    },

    source: {
      type: String,
      enum: ["app", "web", "admin"],
      default: "app",
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
tenantSchema.index({ property: 1, status: 1 });
tenantSchema.index({ owner: 1, status: 1 });
tenantSchema.index({ user: 1, status: 1 });
tenantSchema.index({ "tenancy.startDate": 1 });

// 🧠 METHODS

// Vacate tenant
tenantSchema.methods.vacate = function () {
  this.status = "vacated";
  this.vacatedAt = new Date();
  return this.save();
};

// Terminate tenant
tenantSchema.methods.terminate = function () {
  this.status = "terminated";
  this.vacatedAt = new Date();
  return this.save();
};

const Tenant = mongoose.model("Tenant", tenantSchema);

export default Tenant;
