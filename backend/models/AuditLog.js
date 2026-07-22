const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  userEmail: String,
  userRole: String,
  action: {
    type: String,
    required: [true, 'Action is required'],
    enum: [
      'CREATE', 'READ', 'UPDATE', 'DELETE',
      'LOGIN', 'LOGOUT', 'REGISTER',
      'PASSWORD_RESET', 'PASSWORD_CHANGE',
      'ROLE_CHANGE', 'STATUS_CHANGE',
      'UPLOAD', 'DOWNLOAD', 'EXPORT',
      'APPROVE', 'REJECT', 'ARCHIVE',
    ],
  },
  resource: {
    type: String,
    required: [true, 'Resource is required'],
  },
  resourceId: String,
  description: String,
  changes: {
    before: mongoose.Schema.Types.Mixed,
    after: mongoose.Schema.Types.Mixed,
  },
  ipAddress: String,
  userAgent: String,
  statusCode: Number,
  success: {
    type: Boolean,
    default: true,
  },
  errorMessage: String,
  duration: Number,
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
}, {
  timestamps: true,
});

auditLogSchema.index({ user: 1, createdAt: -1 });
auditLogSchema.index({ action: 1 });
auditLogSchema.index({ resource: 1 });
auditLogSchema.index({ createdAt: -1 });
auditLogSchema.index({ success: 1 });

module.exports = mongoose.model('AuditLog', auditLogSchema);
