import mongoose from "mongoose";

const medicalRecordSchema = new mongoose.Schema(
  {
    // 👤 PATIENT
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // 👨‍⚕️ DOCTOR (who created/updated record)
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },

    doctorProfile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DoctorProfile",
    },

    // 🔗 RELATED APPOINTMENT
    appointment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
      index: true,
    },

    // 🔗 PRESCRIPTION
    prescription: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Prescription",
      index: true,
    },

    // 🩺 MEDICAL DETAILS
    diagnosis: {
      type: String,
      trim: true,
      index: true,
    },

    symptoms: [
      {
        type: String,
        trim: true,
      },
    ],

    allergies: [
      {
        type: String,
        trim: true,
      },
    ],

    chronicConditions: [
      {
        type: String,
        trim: true,
      },
    ],

    // 🧪 TEST REPORTS
    reports: [
      {
        name: {
          type: String,
          trim: true,
        },
        reportDate: Date,
        document: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Document",
        },
        notes: String,
      },
    ],

    // 💊 CURRENT MEDICATIONS
    medications: [
      {
        name: String,
        dosage: String,
        frequency: String,
      },
    ],

    // 🧾 VITALS (optional)
    vitals: {
      heightCm: Number,
      weightKg: Number,
      bloodPressure: String,
      heartRate: Number,
      temperature: Number,
      spo2: Number,
    },

    // 🧠 DOCTOR NOTES
    notes: {
      type: String,
      trim: true,
    },

    // 🔒 VISIBILITY / ACCESS
    visibility: {
      type: String,
      enum: ["private", "shared"],
      default: "private",
      index: true,
    },

    // 🟢 STATUS
    isActive: {
      type: Boolean,
      default: true,
      index: true,
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
medicalRecordSchema.index({ user: 1, createdAt: -1 });
medicalRecordSchema.index({ diagnosis: 1 });
medicalRecordSchema.index({ visibility: 1 });

// 🧠 METHODS

// Share medical record
medicalRecordSchema.methods.share = function () {
  this.visibility = "shared";
  return this.save();
};

const MedicalRecord = mongoose.model(
  "MedicalRecord",
  medicalRecordSchema
);

export default MedicalRecord;
