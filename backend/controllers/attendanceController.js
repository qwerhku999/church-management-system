const Attendance = require('../models/Attendance');
const { successResponse, paginatedResponse, getPaginationParams, getSortParams } = require('../utils/helpers');

const getAttendance = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPaginationParams(req.query);
    const filter = {};

    if (req.query.event) filter.event = req.query.event;
    if (req.query.serviceType) filter.serviceType = req.query.serviceType;
    if (req.query.startDate || req.query.endDate) {
      filter.date = {};
      if (req.query.startDate) filter.date.$gte = new Date(req.query.startDate);
      if (req.query.endDate) filter.date.$lte = new Date(req.query.endDate);
    }

    const [records, total] = await Promise.all([
      Attendance.find(filter)
        .populate('event', 'title startDate category')
        .populate('recordedBy', 'firstName lastName')
        .sort({ date: -1 })
        .skip(skip)
        .limit(limit),
      Attendance.countDocuments(filter),
    ]);

    return paginatedResponse(res, 'Attendance records retrieved.', records, {
      total, page, limit, pages: Math.ceil(total / limit),
    });
  } catch (error) {
    next(error);
  }
};

const getAttendanceRecord = async (req, res, next) => {
  try {
    const record = await Attendance.findById(req.params.id)
      .populate('event', 'title startDate')
      .populate('recordedBy', 'firstName lastName')
      .populate('records.person');
    if (!record) return res.status(404).json({ success: false, message: 'Attendance record not found.' });
    return successResponse(res, 'Attendance record retrieved.', { record });
  } catch (error) {
    next(error);
  }
};

const createAttendance = async (req, res, next) => {
  try {
    const data = { ...req.body, recordedBy: req.user._id };
    if (req.body.records) {
      data.totalCount = req.body.records.filter((r) => r.status === 'present').length;
    }
    const record = await Attendance.create(data);
    return successResponse(res, 'Attendance recorded successfully.', { record }, 201);
  } catch (error) {
    next(error);
  }
};

const updateAttendance = async (req, res, next) => {
  try {
    const record = await Attendance.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!record) return res.status(404).json({ success: false, message: 'Attendance record not found.' });
    return successResponse(res, 'Attendance updated successfully.', { record });
  } catch (error) {
    next(error);
  }
};

const deleteAttendance = async (req, res, next) => {
  try {
    const record = await Attendance.findByIdAndDelete(req.params.id);
    if (!record) return res.status(404).json({ success: false, message: 'Attendance record not found.' });
    return successResponse(res, 'Attendance record deleted successfully.');
  } catch (error) {
    next(error);
  }
};

const getAttendanceStats = async (req, res, next) => {
  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const stats = await Attendance.aggregate([
      { $match: { date: { $gte: thirtyDaysAgo } } },
      {
        $group: {
          _id: '$serviceType',
          avgTotal: { $avg: '$totalCount' },
          avgMembers: { $avg: '$memberCount' },
          avgVisitors: { $avg: '$visitorCount' },
          count: { $sum: 1 },
        },
      },
    ]);
    const trend = await Attendance.find({ date: { $gte: thirtyDaysAgo } })
      .sort({ date: 1 })
      .select('date totalCount memberCount visitorCount serviceType');
    return successResponse(res, 'Attendance statistics retrieved.', { stats, trend });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAttendance, getAttendanceRecord, createAttendance, updateAttendance, deleteAttendance, getAttendanceStats };
