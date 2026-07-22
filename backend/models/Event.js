const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Event title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters'],
  },
  description: {
    type: String,
    trim: true,
  },
  category: {
    type: String,
    enum: ['worship', 'prayer', 'bible_study', 'outreach', 'fellowship', 'conference', 'seminar', 'youth', 'children', 'special', 'other'],
    default: 'other',
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'cancelled', 'completed'],
    default: 'published',
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required'],
  },
  endDate: {
    type: Date,
    required: [true, 'End date is required'],
  },
  startTime: String,
  endTime: String,
  isAllDay: {
    type: Boolean,
    default: false,
  },
  isRecurring: {
    type: Boolean,
    default: false,
  },
  recurrence: {
    frequency: {
      type: String,
      enum: ['daily', 'weekly', 'biweekly', 'monthly', 'yearly'],
    },
    endDate: Date,
    daysOfWeek: [Number],
  },
  location: {
    name: String,
    address: String,
    room: String,
    isOnline: { type: Boolean, default: false },
    onlineLink: String,
  },
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  ministry: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ministry',
  },
  capacity: {
    type: Number,
    default: null,
  },
  registrationRequired: {
    type: Boolean,
    default: false,
  },
  registrationDeadline: Date,
  attendees: [{
    member: { type: mongoose.Schema.Types.ObjectId, ref: 'Member' },
    registeredAt: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ['registered', 'attended', 'no_show', 'cancelled'],
      default: 'registered',
    },
  }],
  tags: [String],
  image: String,
  color: {
    type: String,
    default: '#6366f1',
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

eventSchema.virtual('attendeeCount').get(function () {
  return this.attendees ? this.attendees.length : 0;
});

eventSchema.index({ startDate: 1, endDate: 1 });
eventSchema.index({ status: 1 });
eventSchema.index({ category: 1 });
eventSchema.index({ ministry: 1 });
eventSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Event', eventSchema);
