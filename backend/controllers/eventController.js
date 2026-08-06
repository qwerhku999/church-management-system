const Event = require('../models/Event');
const {
  successResponse,
  paginatedResponse,
  getPaginationParams,
  getSortParams,
  buildSearchFilter,
} = require('../utils/helpers');


// ===============================
// Get All Events
// ===============================

const getEvents = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPaginationParams(req.query);

    const filter = {};

    if (req.query.search) {
      Object.assign(
        filter,
        buildSearchFilter(req.query.search, [
          'title',
          'description',
        ])
      );
    }

    if (req.query.status) {
      filter.status = req.query.status;
    }

    if (req.query.category) {
      filter.category = req.query.category;
    }

    if (req.query.ministry) {
      filter.ministry = req.query.ministry;
    }

    if (req.query.startDate) {
      filter.startDate = {
        $gte: new Date(req.query.startDate),
      };
    }

    if (req.query.endDate) {
      filter.endDate = {
        ...filter.endDate,
        $lte: new Date(req.query.endDate),
      };
    }

    if (req.query.upcoming === 'true') {
      filter.startDate = {
        $gte: new Date(),
      };
    }


    const sort = req.query.sortBy
      ? getSortParams(req.query)
      : { startDate: 1 };


    const [events, total] = await Promise.all([

      Event.find(filter)
        .populate('organizer', 'firstName lastName')
        .populate('ministry', 'name')
        .sort(sort)
        .skip(skip)
        .limit(limit),

      Event.countDocuments(filter),

    ]);


    return paginatedResponse(
      res,
      'Events retrieved successfully.',
      events,
      {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      }
    );

  } catch (error) {
    next(error);
  }
};



// ===============================
// Get Single Event
// ===============================

const getEvent = async (req, res, next) => {
  try {

    const event = await Event.findById(req.params.id)
      .populate('organizer', 'firstName lastName email')
      .populate('ministry', 'name category')
      .populate(
        'attendees.member',
        'firstName lastName email'
      );


    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found.',
      });
    }


    return successResponse(
      res,
      'Event retrieved successfully.',
      { event }
    );


  } catch (error) {
    next(error);
  }
};



// ===============================
// Create Event
// ===============================

const createEvent = async (req, res, next) => {
  try {

    if (req.file) {
      req.body.image = `/uploads/images/${req.file.filename}`;
    }


    const event = await Event.create({
      ...req.body,
      organizer: req.user._id,
      createdBy: req.user._id,
    });


    return successResponse(
      res,
      'Event created successfully.',
      { event },
      201
    );


  } catch (error) {
    next(error);
  }
};



// ===============================
// Update Event
// ===============================

const updateEvent = async (req, res, next) => {
  try {

    if (req.file) {
      req.body.image = `/uploads/images/${req.file.filename}`;
    }


    const event = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );


    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found.',
      });
    }


    return successResponse(
      res,
      'Event updated successfully.',
      { event }
    );


  } catch (error) {
    next(error);
  }
};



// ===============================
// Soft Delete Event
// ===============================

const deleteEvent = async (req, res, next) => {
  try {

    const event = await Event.findByIdAndUpdate(
      req.params.id,
      {
        status: 'cancelled',
      },
      {
        new: true,
      }
    );


    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found.',
      });
    }


    return successResponse(
      res,
      'Event cancelled successfully.'
    );


  } catch (error) {
    next(error);
  }
};



// ===============================
// Register Member For Event
// ===============================

const registerForEvent = async (req, res, next) => {
  try {

    const event = await Event.findById(req.params.id);


    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found.',
      });
    }


    if (event.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Cannot register for a cancelled event.',
      });
    }


    if (
      event.registrationDeadline &&
      new Date() > event.registrationDeadline
    ) {
      return res.status(400).json({
        success: false,
        message: 'Registration deadline has passed.',
      });
    }


    const { memberId } = req.body;


    const alreadyRegistered = event.attendees.some(
      (attendee) =>
        attendee.member.toString() === memberId
    );


    if (alreadyRegistered) {
      return res.status(409).json({
        success: false,
        message: 'Member already registered.',
      });
    }


    if (
      event.capacity &&
      event.attendees.length >= event.capacity
    ) {
      return res.status(400).json({
        success: false,
        message: 'Event capacity reached.',
      });
    }


    event.attendees.push({
      member: memberId,
    });


    await event.save();


    return successResponse(
      res,
      'Member registered successfully.',
      { event }
    );


  } catch (error) {
    next(error);
  }
};



// ===============================
// Calendar Events
// ===============================

const getCalendarEvents = async (req, res, next) => {
  try {

    const {
      month,
      year,
    } = req.query;


    const startDate = new Date(
      year || new Date().getFullYear(),
      (month || new Date().getMonth() + 1) - 1,
      1
    );


    const endDate = new Date(
      startDate.getFullYear(),
      startDate.getMonth() + 1,
      0,
      23,
      59,
      59
    );


    const events = await Event.find({

      startDate: {
        $lte: endDate,
      },

      endDate: {
        $gte: startDate,
      },

      status: {
        $ne: 'draft',
      },

    })
      .populate('organizer', 'firstName lastName')
      .populate('ministry', 'name')
      .sort({
        startDate: 1,
      });


    return successResponse(
      res,
      'Calendar events retrieved.',
      { events }
    );


  } catch (error) {
    next(error);
  }
};



module.exports = {
  getEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
  registerForEvent,
  getCalendarEvents,
};