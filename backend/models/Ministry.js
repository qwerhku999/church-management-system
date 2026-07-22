const mongoose = require('mongoose');

const ministrySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Ministry name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters'],
  },
  description: {
    type: String,
    trim: true,
  },
  category: {
    type: String,
    enum: ['worship', 'outreach', 'children', 'youth', 'men', 'women', 'prayer', 'media', 'hospitality', 'education', 'counseling', 'other'],
    default: 'other',
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'paused'],
    default: 'active',
  },
  leader: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  coLeaders: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  members: [{
    member: { type: mongoose.Schema.Types.ObjectId, ref: 'Member' },
    role: { type: String, default: 'member' },
    joinedAt: { type: Date, default: Date.now },
  }],
  meetingSchedule: {
    day: String,
    time: String,
    frequency: {
      type: String,
      enum: ['weekly', 'biweekly', 'monthly', 'as_needed'],
    },
    location: String,
  },
  budget: {
    annual: { type: Number, default: 0 },
    spent: { type: Number, default: 0 },
    remaining: { type: Number, default: 0 },
  },
  goals: [{
    title: String,
    description: String,
    targetDate: Date,
    completed: { type: Boolean, default: false },
  }],
  color: {
    type: String,
    default: '#6366f1',
  },
  image: String,
  contactEmail: String,
  contactPhone: String,
  socialMedia: {
    facebook: String,
    instagram: String,
    website: String,
  },
  isPublic: {
    type: Boolean,
    default: true,
  },
  notes: String,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

ministrySchema.virtual('memberCount').get(function () {
  return this.members ? this.members.length : 0;
});

ministrySchema.index({ name: 1 });
ministrySchema.index({ status: 1 });
ministrySchema.index({ category: 1 });
ministrySchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Ministry', ministrySchema);
