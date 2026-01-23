import mongoose from "mongoose";

const castSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      index: true,
    },
    role: {
      type: String, // Actor / Actress / Cameo
      trim: true,
    },
    characterName: {
      type: String,
      trim: true,
    },
    profilePhoto: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Document",
    },
  },
  { _id: false }
);

const crewSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      index: true,
    },
    department: {
      type: String, // Director, Producer, Music
      trim: true,
      index: true,
    },
    profilePhoto: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Document",
    },
  },
  { _id: false }
);

const movieSchema = new mongoose.Schema(
  {
    // 🎬 BASIC INFO
    title: {
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

    description: {
      type: String,
      trim: true,
    },

    // 🗣️ LANGUAGES
    languages: [
      {
        type: String,
        trim: true,
        index: true,
        /*
          Hindi, English, Tamil, Telugu
        */
      },
    ],

    // 🎭 GENRES
    genres: [
      {
        type: String,
        trim: true,
        index: true,
        /*
          Action, Drama, Comedy, Thriller
        */
      },
    ],

    // ⏱️ DURATION
    durationMinutes: {
      type: Number,
      required: true,
      min: 1,
    },

    // 🛂 CERTIFICATION
    certification: {
      type: String,
      enum: ["U", "UA", "A", "S"],
      index: true,
    },

    // 📅 RELEASE
    releaseDate: {
      type: Date,
      index: true,
    },

    isUpcoming: {
      type: Boolean,
      default: false,
      index: true,
    },

    // 🎞️ FORMATS
    formats: [
      {
        type: String,
        enum: ["2D", "3D", "IMAX", "4DX"],
        index: true,
      },
    ],

    // 🎥 MEDIA
    poster: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Document",
    },

    banner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Document",
    },

    trailerUrl: {
      type: String,
      trim: true,
    },

    // 👥 CAST & CREW
    cast: [castSchema],
    crew: [crewSchema],

    // ⭐ RATINGS
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 10,
    },

    ratingCount: {
      type: Number,
      default: 0,
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

    // 🧠 META
    tags: [
      {
        type: String,
        trim: true,
        index: true,
      },
    ],

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
movieSchema.index({ title: 1, releaseDate: -1 });
movieSchema.index({ languages: 1, genres: 1 });
movieSchema.index({ isUpcoming: 1, isActive: 1 });

// 🧠 METHODS

// Update rating cache
movieSchema.methods.updateRating = function (avg, count) {
  this.rating = avg;
  this.ratingCount = count;
  return this.save();
};

const Movie = mongoose.model("Movie", movieSchema);

export default Movie;
