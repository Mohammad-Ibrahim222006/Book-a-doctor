const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },

    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "doctor",
      required: true,
    },

    userInfo: {
      type: Object,
      required: true,
    },

    doctorInfo: {
      type: Object,
      required: true,
    },

    date: {
      type: Date,
      required: true,
    },

    document: {
      type: Object,
    },

    status: {
      type: String,
      default: "pending",
    },

    notes: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "appointment",
  appointmentSchema
);