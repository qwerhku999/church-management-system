const Announcement = require('../models/Announcement');
const Notification = require('../models/Notification');
const User = require('../models/User');
const { successResponse, paginatedResponse, getPaginationParams, buildSearchFilter } = require('../utils/helpers');

const getAnnouncements = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPaginationParams(req.query);
    const filter = {};

    if (req.query.search) Object.assign(filter, buildSearchFilter(req.query.search, ['title', 'content']));
    if (req.query.status) filter.status = req.query.status;
    if (req.query.category) filter.category = req.query.category;
    if (req.query.priority) filter.priority = req.query.priority;
    if (!req.query.includeExpired) {
      filter.$or = [{ expiresAt: null }, { expiresAt: { $gte: new Date() } }];
    }

    const [announcements, total] = await Promise.all([
      Announcement.find(filter)
        .populate('createdBy', 'firstName lastName')
        .populate('targetMinistry', 'name')
        .sort({ isPinned: -1, publishDate: -1 })
        .skip(skip)
        .limit(limit),
      Announcement.countDocuments(filter),
    ]);

    return paginatedResponse(res, 'Announcements retrieved.', announcements, {
      total, page, limit, pages: Math.ceil(total / limit),
    });
  } catch (error) {
    next(error);
  }
};

const getAnnouncement = async (req, res, next) => {
  try {
    const announcement = await Announcement.findById(req.params.id)
      .populate('createdBy', 'firstName lastName email')
      .populate('targetMinistry', 'name');
    if (!announcement) return res.status(404).json({ success: false, message: 'Announcement not found.' });
    await Announcement.findByIdAndUpdate(req.params.id, { $inc: { viewCount: 1 } });
    return successResponse(res, 'Announcement retrieved.', { announcement });
  } catch (error) {
    next(error);
  }
};

const createAnnouncement = async (req, res, next) => {
  try {
    if (req.file) req.body.image = `/uploads/images/${req.file.filename}`;
    const announcement = await Announcement.create({ ...req.body, createdBy: req.user._id });

    if (announcement.sendNotification && announcement.status === 'published') {
      const users = await User.find({ isActive: true }).select('_id');
      const notifications = users.map((u) => ({
        title: announcement.title,
        message: announcement.summary || announcement.content.substring(0, 150),
        type: 'announcement',
        recipient: u._id,
        sender: req.user._id,
        link: `/announcements/${announcement._id}`,
      }));
      await Notification.insertMany(notifications);
    }

    return successResponse(res, 'Announcement created.', { announcement }, 201);
  } catch (error) {
    next(error);
  }
};

const updateAnnouncement = async (req, res, next) => {
  try {
    if (req.file) req.body.image = `/uploads/images/${req.file.filename}`;
    const announcement = await Announcement.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!announcement) return res.status(404).json({ success: false, message: 'Announcement not found.' });
    return successResponse(res, 'Announcement updated.', { announcement });
  } catch (error) {
    next(error);
  }
};

const deleteAnnouncement = async (req, res, next) => {
  try {
    const announcement = await Announcement.findByIdAndDelete(req.params.id);
    if (!announcement) return res.status(404).json({ success: false, message: 'Announcement not found.' });
    return successResponse(res, 'Announcement deleted.');
  } catch (error) {
    next(error);
  }
};

const togglePin = async (req, res, next) => {
  try {
    const announcement = await Announcement.findById(req.params.id);
    if (!announcement) return res.status(404).json({ success: false, message: 'Announcement not found.' });
    announcement.isPinned = !announcement.isPinned;
    await announcement.save();
    return successResponse(res, `Announcement ${announcement.isPinned ? 'pinned' : 'unpinned'}.`, { announcement });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAnnouncements, getAnnouncement, createAnnouncement, updateAnnouncement, deleteAnnouncement, togglePin };
