const mongoose = require('mongoose');

const visitorSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
  },
  email: {
    type: String,
    lowercase: true,
    trim: true,
  },
  phone: {
    type: String,
    trim: true,
  },
  dateOfBirth: Date,
  gender: {
    type: String,
    enum: ['male', 'female', 'other', 'prefer_not_to_say'],
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: { type: String, default: 'US' },
  },
  visitDate: {
    type: Date,
    default: Date.now,
  },
  visitCount: {
    type: Number,
    default: 1,
  },
  visitHistory: [{
    date: { type: Date, default: Date.now },
    event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
    notes: String,
  }],
  howHeard: {
    type: String,
    enum: ['friend', 'family', 'social_media', 'website', 'flyer', 'walk_in', 'other'],
  },
  interestedIn: [{
    type: String,
    enum: ['membership', 'volunteering', 'small_groups', 'ministries', 'counseling', 'other'],
  }],
  followUpStatus: {
    type: String,
    enum: ['pending', 'contacted', 'not_interested', 'became_member', 'no_response'],
    default: 'pending',
  },
  followUpDate: Date,
  followUpNotes: String,
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  convertedToMember: {
    type: Boolean,
    default: false,
  },
  memberId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Member',
  },
  notes: String,
  isActive: {
    type: Boolean,
    default: true,
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

visitorSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

visitorSchema.index({ firstName: 1, lastName: 1 });
visitorSchema.index({ email: 1 });
visitorSchema.index({ followUpStatus: 1 });
visitorSchema.index({ visitDate: -1 });

module.exports = mongoose.model('Visitor', visitorSchema);
