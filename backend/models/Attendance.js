const mongoose = require('mongoose');


const attendanceSchema = new mongoose.Schema({

  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true,
  },


  serviceType: {
    type: String,
    enum: [
      'sunday_service',
      'midweek_service',
      'prayer_meeting',
      'bible_study',
      'event',
      'other'
    ],
    default: 'sunday_service',
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


  totalCount: {
    type: Number,
    default: 0,
  },


  records: [
    {
      person: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Member',
        required: true,
      },


      status: {
        type: String,
        enum: [
          'present',
          'absent',
          'late',
          'excused'
        ],
        default: 'present',
      },


      notes: {
        type: String,
        trim: true,
      }

    }
  ],


  date: {
    type: Date,
    default: Date.now,
  },


  recordedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },


}, {
  timestamps: true,
});



// Search indexes

attendanceSchema.index({
  event: 1,
  date: -1
});


attendanceSchema.index({
  serviceType: 1
});


attendanceSchema.index({
  status: 1
});


attendanceSchema.index({
  'records.person': 1
});



module.exports = mongoose.model(
  'Attendance',
  attendanceSchema
);