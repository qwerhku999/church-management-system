const mongoose = require('mongoose');

const financeSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['income', 'expense', 'transfer', 'budget'],
    required: [true, 'Transaction type is required'],
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true,
  },
  subcategory: String,
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [0, 'Amount cannot be negative'],
  },
  currency: {
    type: String,
    default: 'USD',
    uppercase: true,
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
  },
  date: {
    type: Date,
    required: [true, 'Date is required'],
    default: Date.now,
  },
  account: {
    type: String,
    enum: ['general', 'building', 'missions', 'outreach', 'operations', 'savings', 'other'],
    default: 'general',
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'check', 'bank_transfer', 'credit_card', 'debit_card', 'online', 'other'],
  },
  vendor: String,
  invoiceNumber: String,
  receiptUrl: String,
  ministry: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ministry',
  },
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
  },
  budget: {
    allocated: { type: Number, default: 0 },
    period: { type: String, enum: ['monthly', 'quarterly', 'annual'] },
    year: Number,
    month: Number,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'completed'],
    default: 'completed',
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  approvedAt: Date,
  tags: [String],
  notes: String,
  attachments: [String],
  isRecurring: {
    type: Boolean,
    default: false,
  },
  recurrence: {
    frequency: { type: String, enum: ['weekly', 'monthly', 'quarterly', 'annual'] },
    endDate: Date,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true,
});

financeSchema.index({ type: 1, date: -1 });
financeSchema.index({ category: 1 });
financeSchema.index({ date: -1 });
financeSchema.index({ status: 1 });
financeSchema.index({ ministry: 1 });

module.exports = mongoose.model('Finance', financeSchema);
