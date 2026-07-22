const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters'],
  },
  description: {
    type: String,
    trim: true,
  },
  category: {
    type: String,
    enum: ['policy', 'form', 'report', 'minutes', 'constitution', 'budget', 'contract', 'legal', 'media', 'other'],
    default: 'other',
  },
  fileUrl: {
    type: String,
    required: [true, 'File URL is required'],
  },
  fileName: {
    type: String,
    required: [true, 'File name is required'],
  },
  fileSize: Number,
  mimeType: String,
  fileExtension: String,
  version: {
    type: String,
    default: '1.0',
  },
  accessLevel: {
    type: String,
    enum: ['public', 'members', 'leaders', 'admin'],
    default: 'members',
  },
  allowedRoles: [{
    type: String,
    enum: ['super_admin', 'admin', 'pastor', 'secretary', 'treasurer', 'finance_officer', 'ministry_leader', 'volunteer', 'member'],
  }],
  ministry: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ministry',
  },
  tags: [String],
  downloadCount: {
    type: Number,
    default: 0,
  },
  viewCount: {
    type: Number,
    default: 0,
  },
  isPublic: {
    type: Boolean,
    default: false,
  },
  isArchived: {
    type: Boolean,
    default: false,
  },
  expiresAt: Date,
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true,
});

documentSchema.index({ category: 1 });
documentSchema.index({ accessLevel: 1 });
documentSchema.index({ title: 'text', description: 'text', tags: 'text' });
documentSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Document', documentSchema);
