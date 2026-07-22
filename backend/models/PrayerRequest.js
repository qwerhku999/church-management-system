const mongoose = require('mongoose');

const prayerRequestSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters'],
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
  },
  submittedBy: {
    member: { type: mongoose.Schema.Types.ObjectId, ref: 'Member' },
    name: String,
    email: String,
    isAnonymous: { type: Boolean, default: false },
  },
  category: {
    type: String,
    enum: ['health', 'family', 'finance', 'relationships', 'career', 'spiritual', 'grief', 'addiction', 'community', 'other'],
    default: 'other',
  },
  urgency: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium',
  },
  status: {
    type: String,
    enum: ['pending', 'active', 'answered', 'closed'],
    default: 'pending',
  },
  isPrivate: {
    type: Boolean,
    default: false,
  },
  isPublic: {
    type: Boolean,
    default: true,
  },
  prayerCount: {
    type: Number,
    default: 0,
  },
  prayers: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    prayedAt: { type: Date, default: Date.now },
  }],
  updates: [{
    content: String,
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    updatedAt: { type: Date, default: Date.now },
  }],
  answeredDate: Date,
  answeredDescription: String,
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  ministry: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ministry',
  },
  expiresAt: Date,
  notes: String,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, {
  timestamps: true,
});

prayerRequestSchema.index({ status: 1 });
prayerRequestSchema.index({ category: 1 });
prayerRequestSchema.index({ urgency: 1 });
prayerRequestSchema.index({ createdAt: -1 });

module.exports = mongoose.model('PrayerRequest', prayerRequestSchema);
