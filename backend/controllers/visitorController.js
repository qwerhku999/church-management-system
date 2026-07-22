const Visitor = require('../models/Visitor');
const { successResponse, paginatedResponse, getPaginationParams, getSortParams, buildSearchFilter } = require('../utils/helpers');

const getVisitors = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPaginationParams(req.query);
    const sort = getSortParams(req.query);
    const filter = {};

    if (req.query.search) {
      Object.assign(filter, buildSearchFilter(req.query.search, ['firstName', 'lastName', 'email', 'phone']));
    }
    if (req.query.followUpStatus) filter.followUpStatus = req.query.followUpStatus;
    if (req.query.convertedToMember !== undefined) filter.convertedToMember = req.query.convertedToMember === 'true';

    const [visitors, total] = await Promise.all([
      Visitor.find(filter)
        .populate('assignedTo', 'firstName lastName')
        .sort(sort)
        .skip(skip)
        .limit(limit),
      Visitor.countDocuments(filter),
    ]);

    return paginatedResponse(res, 'Visitors retrieved successfully.', visitors, {
      total, page, limit, pages: Math.ceil(total / limit),
    });
  } catch (error) {
    next(error);
  }
};

const getVisitor = async (req, res, next) => {
  try {
    const visitor = await Visitor.findById(req.params.id)
      .populate('assignedTo', 'firstName lastName email')
      .populate('memberId', 'firstName lastName memberNumber');
    if (!visitor) return res.status(404).json({ success: false, message: 'Visitor not found.' });
    return successResponse(res, 'Visitor retrieved successfully.', { visitor });
  } catch (error) {
    next(error);
  }
};

const createVisitor = async (req, res, next) => {
  try {
    const visitor = await Visitor.create({ ...req.body, addedBy: req.user._id });
    return successResponse(res, 'Visitor created successfully.', { visitor }, 201);
  } catch (error) {
    next(error);
  }
};

const updateVisitor = async (req, res, next) => {
  try {
    const visitor = await Visitor.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!visitor) return res.status(404).json({ success: false, message: 'Visitor not found.' });
    return successResponse(res, 'Visitor updated successfully.', { visitor });
  } catch (error) {
    next(error);
  }
};

const deleteVisitor = async (req, res, next) => {
  try {
    const visitor = await Visitor.findByIdAndDelete(req.params.id);
    if (!visitor) return res.status(404).json({ success: false, message: 'Visitor not found.' });
    return successResponse(res, 'Visitor deleted successfully.');
  } catch (error) {
    next(error);
  }
};

const updateFollowUp = async (req, res, next) => {
  try {
    const { followUpStatus, followUpNotes, followUpDate, assignedTo } = req.body;
    const visitor = await Visitor.findByIdAndUpdate(
      req.params.id,
      { followUpStatus, followUpNotes, followUpDate, assignedTo },
      { new: true }
    );
    if (!visitor) return res.status(404).json({ success: false, message: 'Visitor not found.' });
    return successResponse(res, 'Follow-up updated successfully.', { visitor });
  } catch (error) {
    next(error);
  }
};

const getVisitorStats = async (req, res, next) => {
  try {
    const [total, pending, contacted, converted] = await Promise.all([
      Visitor.countDocuments(),
      Visitor.countDocuments({ followUpStatus: 'pending' }),
      Visitor.countDocuments({ followUpStatus: 'contacted' }),
      Visitor.countDocuments({ convertedToMember: true }),
    ]);
    return successResponse(res, 'Visitor statistics retrieved.', { stats: { total, pending, contacted, converted } });
  } catch (error) {
    next(error);
  }
};

module.exports = { getVisitors, getVisitor, createVisitor, updateVisitor, deleteVisitor, updateFollowUp, getVisitorStats };
