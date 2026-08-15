const mongoose = require("mongoose");

const attendanceRecordSchema = new mongoose.Schema(
  {
    person: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member",
      required: true,
    },

    status: {
      type: String,
      enum: ["present", "absent", "late", "excused"],
      required: true,
    },

    checkInTime: {
      type: Date,
      default: null,
    },

    notes: {
      type: String,
      trim: true,
      maxlength: 500,
    },
  },
  { _id: false }
);

const attendanceSchema = new mongoose.Schema(
  {
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },

    serviceType: {
      type: String,
      enum: [
        "sunday_service",
        "midweek_service",
        "special_service",
        "prayer_meeting",
        "other",
      ],
      required: true,
    },

    date: {
      type: Date,
      required: true,
    },

    records: {
      type: [attendanceRecordSchema],
      default: [],
    },

    memberCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    visitorCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    childrenCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    onlineCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    totalCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    recordedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    notes: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
  },
  {
    timestamps: true,
  }
);

/*
 * Automatically keep aggregate counts consistent.
 */
attendanceSchema.pre("validate", function (next) {
  this.memberCount = this.records.length;

  this.totalCount =
    this.memberCount +
    this.visitorCount +
    this.childrenCount +
    this.onlineCount;

  next();
});

/*
 * Indexes
 */
attendanceSchema.index({ event: 1 });
attendanceSchema.index({ date: -1 });
attendanceSchema.index({ serviceType: 1 });
attendanceSchema.index({ "records.person": 1 });
attendanceSchema.index({ "records.status": 1 });

/*
 * Prevent duplicate attendance documents
 * for the same event/service.
 */
attendanceSchema.index(
  {
    event: 1,
    serviceType: 1,
  },
  {
    unique: true,
  }
);

module.exports = mongoose.model("Attendance", attendanceSchema);
