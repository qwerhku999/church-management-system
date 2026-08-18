const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Event title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },

    description: {
      type: String,
      trim: true,
    },

    category: {
      type: String,
      enum: [
        "worship",
        "prayer",
        "bible_study",
        "outreach",
        "fellowship",
        "conference",
        "seminar",
        "youth",
        "children",
        "special",
        "other",
      ],
      default: "other",
    },

    status: {
      type: String,
      enum: ["draft", "published", "cancelled", "completed"],
      default: "draft",
    },

    startDate: {
      type: Date,
      required: [true, "Start date is required"],
    },

    endDate: {
      type: Date,
      required: [true, "End date is required"],
    },

    startTime: {
      type: String,
      trim: true,
    },

    endTime: {
      type: String,
      trim: true,
    },

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
        enum: ["daily", "weekly", "biweekly", "monthly", "yearly"],
      },

      endDate: Date,

      daysOfWeek: [Number],
    },

    location: {
      name: {
        type: String,
        trim: true,
      },

      address: {
        type: String,
        trim: true,
      },

      room: {
        type: String,
        trim: true,
      },

      isOnline: {
        type: Boolean,
        default: false,
      },

      onlineLink: {
        type: String,
        trim: true,
      },
    },

    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    ministry: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ministry",
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

    attendees: [
      {
        member: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Member",
        },

        registeredAt: {
          type: Date,
          default: Date.now,
        },

        status: {
          type: String,
          enum: [
            "registered",
            "attended",
            "no_show",
            "cancelled",
          ],
          default: "registered",
        },
      },
    ],

    tags: [String],

    image: String,

    color: {
      type: String,
      default: "#6366f1",
    },

    isPublic: {
      type: Boolean,
      default: true,
    },

    notes: String,

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    publishedAt: {
      type: Date,
      default: null,
    },

    notificationsSentAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,

    toJSON: {
      virtuals: true,
    },

    toObject: {
      virtuals: true,
    },
  }
);

/*
 * Virtual attendee count
 */
eventSchema.virtual("attendeeCount").get(function () {
  return this.attendees ? this.attendees.length : 0;
});

/*
 * Indexes
 */
eventSchema.index({
  startDate: 1,
  endDate: 1,
});

eventSchema.index({
  status: 1,
});

eventSchema.index({
  category: 1,
});

eventSchema.index({
  ministry: 1,
});

eventSchema.index({
  title: "text",
  description: "text",
});

/*
 * Validate dates
 */
eventSchema.pre("validate", function (next) {
  if (
    this.startDate &&
    this.endDate &&
    this.endDate < this.startDate
  ) {
    return next(
      new Error("Event end date cannot be before start date.")
    );
  }

  next();
});

module.exports = mongoose.model("Event", eventSchema);