const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      set: function (value) {
        return value.charAt(0).toUpperCase() + value.slice(1);
      },
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
    },

    isdoctor: {
      type: Boolean,
      default: false,
    },

    type: {
      type: String,
      default: "user",
    },

    notification: {
      type: Array,
      default: [],
    },

    seennotification: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("user", userSchema);