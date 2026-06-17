const mongoose = require("mongoose");

const docSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },

    fullName: {
      type: String,
      required: [true, "full name is required"],
      set: function (value) {
        return value.charAt(0).toUpperCase() + value.slice(1);
      },
    },

    email: {
      type: String,
      required: [true, "email is required"],
    },

    phone: {
      type: String,
      required: [true, "phone is required"],
    },

    address: {
      type: String,
      required: [true, "address is required"],
    },

    specialization: {
      type: String,
      required: [true, "specialization is required"],
    },

    experience: {
      type: String,
      required: [true, "experience is required"],
    },

    fees: {
      type: Number,
      required: [true, "fees is required"],
    },

    status: {
      type: String,
      default: "pending",
    },

    timings: {
      type: Object,
      required: [true, "timings are required"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("doctor", docSchema);