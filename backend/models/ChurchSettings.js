const mongoose = require("mongoose");

const churchSettingsSchema = new mongoose.Schema(
  {
    churchName: {
      type: String,
      required: true,
      trim: true,
      default: "MinistryFlow Church",
    },

    logo: {
      type: String,
      default: "",
      trim: true,
    },

    address: {
      type: String,
      default: "",
      trim: true,
    },

    phone: {
      type: String,
      default: "",
      trim: true,
    },

    currency: {
      type: String,
      default: "GHS",
      trim: true,
    },

    reportFooter: {
      type: String,
      default: "Official MinistryFlow Report",
      trim: true,
    },

    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "ChurchSettings",
  churchSettingsSchema
);
