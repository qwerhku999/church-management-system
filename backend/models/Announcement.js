const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters'],
  },
  content: {
    type: String,
    required: [true, 'Content is required'],
    trim: true,
  },
  summary: {
    type: String,
    trim: true,
    maxlength: [300, 'Summary cannot exceed 300 characters'],
  },
  category: {
    type: String,
    enum: ['general', 'event', 'urgent', 'ministry', 'financial', 'prayer', 'volunteer', 'other'],
    default: 'general',
  },
  priority: {
    type: String,
    enum: ['low', 'normal', 'high', 'urgent'],
    default: 'normal',
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived', 'scheduled'],
    default: 'published',
  },
  publishDate: {
    type: Date,
    default: Date.now,
  },
  expiresAt: Date,
  targetAudience: [{
    type: String,
    enum: ['all', 'members', 'visitors', 'leaders', 'volunteers', 'specific_ministry'],
  }],
  targetMinistry: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ministry',
  },
  image: String,
  attachments: [String],
  viewCount: {
    type: Number,
    default: 0,
  },
  likes: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    likedAt: { type: Date, default: Date.now },
  }],
  comments: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    content: String,
    createdAt: { type: Date, default: Date.now },
  }],
  isPinned: {
    type: Boolean,
    default: false,
  },
  sendNotification: {
    type: Boolean,
    default: true,
  },
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true,
});

announcementSchema.index({ status: 1, publishDate: -1 });
announcementSchema.index({ category: 1 });
announcementSchema.index({ isPinned: -1, publishDate: -1 });
announcementSchema.index({ title: 'text', content: 'text' });

module.exports = mongoose.model('Announcement', announcementSchema);
