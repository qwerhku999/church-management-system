const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  donor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Member',
  },

  donorName: {
    type: String,
    trim: true,
  },

  donorEmail: {
    type: String,
    lowercase: true,
    trim: true,
  },

  isAnonymous: {
    type: Boolean,
    default: false,
  },

  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [0.01, 'Amount must be greater than 0'],
  },

  currency: {
    type: String,
    default: 'GHS',
    uppercase: true,
  },

  category: {
    type: String,
    enum: [
      'tithe',
      'offering',
      'building_fund',
      'missions',
      'special',
      'pledge',
      'other'
    ],
    required: [true, 'Donation category is required'],
  },

  paymentMethod: {
    type: String,
    enum: [
      'cash',
      'check',
      'credit_card',
      'debit_card',
      'bank_transfer',
      'online',
      'mobile_money',
      'other'
    ],
    required: [true, 'Payment method is required'],
  },

  transactionReference: {
    type: String,
    trim: true,
  },

  checkNumber: String,

  donationDate: {
    type: Date,
    default: Date.now,
  },

  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
  },

  campaign: String,

  pledgeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Donation',
  },

  status: {
    type: String,
    enum: [
      'pending',
      'completed',
      'failed',
      'refunded'
    ],
    default: 'completed',
  },

  receiptNumber: {
    type: String,
    unique: true,
    sparse: true,
  },

  receiptSent: {
    type: Boolean,
    default: false,
  },

  notes: String,

  taxDeductible: {
    type: Boolean,
    default: true,
  },

  recordedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },

}, {
  timestamps: true,
});


donationSchema.pre('save', function(next) {
  if (!this.receiptNumber) {
    this.receiptNumber = `RCP${Date.now()}`;
  }

  next();
});


donationSchema.index({ donor: 1, donationDate: -1 });
donationSchema.index({ donationDate: -1 });
donationSchema.index({ category: 1 });
donationSchema.index({ status: 1 });

donationSchema.index({ recordedBy: 1 });
donationSchema.index({ paymentMethod: 1 });


module.exports = mongoose.model('Donation', donationSchema);