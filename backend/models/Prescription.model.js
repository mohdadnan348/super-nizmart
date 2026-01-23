import mongoose from "mongoose";

const medicineSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    dosage: {
      type: String, // e.g. "1-0-1"
      required: true,
    },

    duration: {
      type: String, // e.g. "5 days"
      required: true,
    },

    instructions: {
      type: String, // after food, before sleep
      trim: true,
    },
  },
  { _id: false }
);

const prescriptionSchema = new mongoose.Schema(
  {
    // 🔗 APPOINTMENT
    appointment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
      required: true,
      unique: true,
      index: true,
    },

    // 👤 PATIENT
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // 👨‍⚕️ DOCTOR
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    doctorProfile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DoctorProfile",
    },

    // 🩺 DIAGNOSIS
    diagnosis: {
      type: String,
      trim: true,
    },

    symptoms: [
      {
        type: String,
        trim: true,
      },
    ],

    // 💊 MEDICINES
    medicines: {
      type: [medicineSchema],
      required: true,
      validate: [(v) => v.length > 0, "At least one medicine is required"],
    },

    // 🧪 TESTS / INVESTIGATIONS
    tests: [
      {
        name: String,
        instructions: String,
      },
    ],

    // 🔁 FOLLOW UP
    followUp: {
      required: {
        type: Boolean,
        default: false,
      },
      afterDays: {
        type: Number,
        min: 1,
      },
      notes: {
        type: String,
        trim: true,
      },
    },

    // 🧾 GENERAL ADVICE
    advice: {
      type: String,
      trim: true,
    },

    // 📄 DIGITAL PRESCRIPTION (PDF)
    document: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Document",
    },

    // 🟢 STATUS
    status: {
      type: String,
      enum: ["issued", "updated"],
      default: "issued",
      index: true,
    },

    issuedAt: {
      type: Date,
      default: Date.now,
    },

    // 🧑‍💼 META
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
prescriptionSchema.index({ user: 1, issuedAt: -1 });
prescriptionSchema.index({ doctor: 1, issuedAt: -1 });

// 🧠 METHODS

// Update prescription
prescriptionSchema.methods.updatePrescription = function () {
  this.status = "updated";
  return this.save();
};

const Prescription = mongoose.model(
  "Prescription",
  prescriptionSchema
);

export default Prescription;
