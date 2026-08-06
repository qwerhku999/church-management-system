const mongoose = require("mongoose");

const financeSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: [
        "income",
        "expense"
      ],
      required: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },

    description: {
      type: String,
      trim: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    currency: {
      type: String,
      default: "GHS",
      uppercase: true,
    },

    paymentMethod: {
      type: String,
      enum: [
        "cash",
        "bank_transfer",
        "mobile_money",
        "card",
        "cheque",
        "other"
      ],
      default: "cash",
    },

    referenceNumber: {
      type: String,
      trim: true,
    },

    date: {
      type: Date,
      default: Date.now,
    },

    department: {
      type: String,
      trim: true,
    },

    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    recordedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    status: {
      type: String,
      enum: [
        "pending",
        "approved",
        "rejected"
      ],
      default: "approved",
    },

    attachments: [
      {
        type: String,
      }
    ],

    notes: String,

  },
  {
    timestamps: true,
  }
);


financeSchema.index({
  type: 1,
  date: -1
});

financeSchema.index({
  category: 1
});

financeSchema.index({
  status: 1
});


module.exports = mongoose.model(
  "Finance",
  financeSchema
);