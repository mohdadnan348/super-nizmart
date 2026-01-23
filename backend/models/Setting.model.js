import mongoose from "mongoose";

const settingSchema = new mongoose.Schema(
  {
    // 🔑 KEY (unique identifier)
    key: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      index: true,
      /*
        Examples:
        site.name
        payment.gateway
        booking.cancellationWindow
        feature.cinemaEnabled
      */
    },

    // 🧾 VALUE (flexible)
    value: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },

    // 🏷️ TYPE (for validation / UI)
    valueType: {
      type: String,
      enum: ["string", "number", "boolean", "json", "array"],
      required: true,
      index: true,
    },

    // 🧩 MODULE (grouping)
    module: {
      type: String,
      trim: true,
      index: true,
      /*
        auth, payment, booking, hotel, cinema, property, ride
      */
    },

    // 🌍 SCOPE
    scope: {
      type: String,
      enum: ["global", "module", "tenant"],
      default: "global",
      index: true,
    },

    // 🧪 ENV (optional override)
    environment: {
      type: String,
      enum: ["dev", "staging", "prod"],
      default: "prod",
      index: true,
    },

    // 🟢 STATUS
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },

    // 🔒 SECURITY
    isSensitive: {
      type: Boolean,
      default: false,
      /*
        true = mask value in UI (API keys, secrets)
      */
    },

    // 👤 UPDATED BY (ADMIN)
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    updatedAtByAdmin: {
      type: Date,
    },

    // 🧠 META
    description: {
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
settingSchema.index({ module: 1, isActive: 1 });
settingSchema.index({ scope: 1, environment: 1 });

// 🧠 STATIC HELPERS

// Get setting by key (with default)
settingSchema.statics.getValue = async function (key, defaultValue = null) {
  const setting = await this.findOne({ key, isActive: true, isDeleted: false });
  return setting ? setting.value : defaultValue;
};

// Set or update setting
settingSchema.statics.setValue = async function ({
  key,
  value,
  valueType,
  module,
  scope = "global",
  environment = "prod",
  updatedBy,
  description,
  isSensitive = false,
}) {
  return this.findOneAndUpdate(
    { key },
    {
      key,
      value,
      valueType,
      module,
      scope,
      environment,
      isSensitive,
      updatedBy,
      updatedAtByAdmin: new Date(),
      description,
      isActive: true,
    },
    { upsert: true, new: true }
  );
};

const Setting = mongoose.model("Setting", settingSchema);

export default Setting;
