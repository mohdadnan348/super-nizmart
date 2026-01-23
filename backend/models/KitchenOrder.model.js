import mongoose from "mongoose";

const kitchenItemSchema = new mongoose.Schema(
  {
    menuItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MenuItem",
      required: true,
    },

    name: {
      type: String, // snapshot
      required: true,
    },

    variant: {
      name: String, // Half / Full
      price: Number,
    },

    addons: [
      {
        name: String,
        price: Number,
      },
    ],

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    // 🍳 PREPARATION
    station: {
      type: String,
      /*
        Examples:
        Tandoor, Fry, Grill, Bar, Dessert
      */
      index: true,
    },

    prepTimeMinutes: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["pending", "preparing", "ready", "served"],
      default: "pending",
      index: true,
    },

    startedAt: Date,
    completedAt: Date,
  },
  { _id: false }
);

const kitchenOrderSchema = new mongoose.Schema(
  {
    // 🔗 FOOD ORDER LINK
    foodOrder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FoodOrder",
      required: true,
      unique: true,
      index: true,
    },

    // 🔗 RESTAURANT
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
      index: true,
    },

    // 🪑 TABLE (for dine-in)
    table: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Table",
    },

    // 🍽️ ORDER TYPE
    orderType: {
      type: String,
      enum: ["delivery", "dine-in", "takeaway"],
      required: true,
      index: true,
    },

    // 🔥 PRIORITY
    priority: {
      type: String,
      enum: ["low", "normal", "high"],
      default: "normal",
      index: true,
    },

    // 🧾 ITEMS FOR KITCHEN
    items: {
      type: [kitchenItemSchema],
      required: true,
      validate: [(v) => v.length > 0, "Kitchen order must have items"],
    },

    // 🟢 KITCHEN STATUS (overall)
    status: {
      type: String,
      enum: ["queued", "preparing", "ready", "completed"],
      default: "queued",
      index: true,
    },

    // ⏱️ TIMERS
    queuedAt: {
      type: Date,
      default: Date.now,
    },

    startedAt: Date,
    completedAt: Date,

    // 🧠 META
    notes: {
      type: String,
      trim: true,
    },

    // 📊 STATS
    stats: {
      totalPrepTime: {
        type: Number, // minutes
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
kitchenOrderSchema.index({ restaurant: 1, status: 1 });
kitchenOrderSchema.index({ orderType: 1, priority: 1 });
kitchenOrderSchema.index({ "items.station": 1, "items.status": 1 });

// 🧠 METHODS

// Start kitchen order
kitchenOrderSchema.methods.start = function () {
  this.status = "preparing";
  this.startedAt = new Date();
  return this.save();
};

// Mark kitchen order completed
kitchenOrderSchema.methods.complete = function () {
  this.status = "completed";
  this.completedAt = new Date();
  return this.save();
};

const KitchenOrder = mongoose.model(
  "KitchenOrder",
  kitchenOrderSchema
);

export default KitchenOrder;
