const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: [true, 'Event is required'],
  },
  date: {
    type: Date,
    required: [true, 'Attendance date is required'],
  },
  serviceType: {
    type: String,
    enum: ['sunday_service', 'midweek', 'prayer_meeting', 'bible_study', 'special_service', 'youth_service', 'children_service', 'other'],
    default: 'sunday_service',
  },
  totalCount: {
    type: Number,
    default: 0,
  },
  memberCount: {
    type: Number,
    default: 0,
  },
  visitorCount: {
    type: Number,
    default: 0,
  },
  childrenCount: {
    type: Number,
    default: 0,
  },
  onlineCount: {
    type: Number,
    default: 0,
  },
  records: [{
    person: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'records.personModel',
    },
    personModel: {
      type: String,
      enum: ['Member', 'Visitor'],
    },
    status: {
      type: String,
      enum: ['present', 'absent', 'excused', 'late'],
      default: 'present',
    },
    checkInTime: Date,
    checkOutTime: Date,
    notes: String,
  }],
  notes: String,
  weather: String,
  specialOccasion: String,
  recordedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

attendanceSchema.index({ event: 1, date: -1 });
attendanceSchema.index({ date: -1 });
attendanceSchema.index({ serviceType: 1 });

module.exports = mongoose.model('Attendance', attendanceSchema);
