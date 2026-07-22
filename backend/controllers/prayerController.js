const PrayerRequest = require('../models/PrayerRequest');
const { successResponse, paginatedResponse, getPaginationParams, getSortParams, buildSearchFilter } = require('../utils/helpers');

const getPrayerRequests = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPaginationParams(req.query);
    const filter = {};

    if (req.query.search) Object.assign(filter, buildSearchFilter(req.query.search, ['title', 'description']));
    if (req.query.status) filter.status = req.query.status;
    if (req.query.category) filter.category = req.query.category;
    if (req.query.urgency) filter.urgency = req.query.urgency;
    if (req.query.isPrivate !== undefined) filter.isPrivate = req.query.isPrivate === 'true';

    const [requests, total] = await Promise.all([
      PrayerRequest.find(filter)
        .populate('submittedBy.member', 'firstName lastName')
        .populate('assignedTo', 'firstName lastName')
        .sort({ urgency: 1, createdAt: -1 })
        .skip(skip)
        .limit(limit),
      PrayerRequest.countDocuments(filter),
    ]);

    return paginatedResponse(res, 'Prayer requests retrieved.', requests, {
      total, page, limit, pages: Math.ceil(total / limit),
    });
  } catch (error) {
    next(error);
  }
};

const getPrayerRequest = async (req, res, next) => {
  try {
    const request = await PrayerRequest.findById(req.params.id)
      .populate('submittedBy.member', 'firstName lastName')
      .populate('assignedTo', 'firstName lastName email')
      .populate('prayers.user', 'firstName lastName');
    if (!request) return res.status(404).json({ success: false, message: 'Prayer request not found.' });
    return successResponse(res, 'Prayer request retrieved.', { request });
  } catch (error) {
    next(error);
  }
};

const createPrayerRequest = async (req, res, next) => {
  try {
    const request = await PrayerRequest.create({ ...req.body, createdBy: req.user._id });
    return successResponse(res, 'Prayer request submitted.', { request }, 201);
  } catch (error) {
    next(error);
  }
};

const updatePrayerRequest = async (req, res, next) => {
  try {
    const request = await PrayerRequest.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!request) return res.status(404).json({ success: false, message: 'Prayer request not found.' });
    return successResponse(res, 'Prayer request updated.', { request });
  } catch (error) {
    next(error);
  }
};

const deletePrayerRequest = async (req, res, next) => {
  try {
    const request = await PrayerRequest.findByIdAndDelete(req.params.id);
    if (!request) return res.status(404).json({ success: false, message: 'Prayer request not found.' });
    return successResponse(res, 'Prayer request deleted.');
  } catch (error) {
    next(error);
  }
};

const prayForRequest = async (req, res, next) => {
  try {
    const request = await PrayerRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ success: false, message: 'Prayer request not found.' });
    const alreadyPrayed = request.prayers.some((p) => p.user.toString() === req.user._id.toString());
    if (alreadyPrayed) {
      request.prayers = request.prayers.filter((p) => p.user.toString() !== req.user._id.toString());
      request.prayerCount = Math.max(0, request.prayerCount - 1);
    } else {
      request.prayers.push({ user: req.user._id });
      request.prayerCount += 1;
    }
    await request.save();
    return successResponse(res, alreadyPrayed ? 'Removed prayer.' : 'Prayer recorded.', { request });
  } catch (error) {
    next(error);
  }
};

const addUpdate = async (req, res, next) => {
  try {
    const request = await PrayerRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ success: false, message: 'Prayer request not found.' });
    request.updates.push({ content: req.body.content, updatedBy: req.user._id });
    if (req.body.status) request.status = req.body.status;
    await request.save();
    return successResponse(res, 'Update added.', { request });
  } catch (error) {
    next(error);
  }
};

module.exports = { getPrayerRequests, getPrayerRequest, createPrayerRequest, updatePrayerRequest, deletePrayerRequest, prayForRequest, addUpdate };
