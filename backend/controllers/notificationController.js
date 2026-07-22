const Notification = require('../models/Notification');
const { successResponse, paginatedResponse, getPaginationParams } = require('../utils/helpers');

const getNotifications = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPaginationParams(req.query);
    const filter = { recipient: req.user._id };

    if (req.query.isRead !== undefined) filter.isRead = req.query.isRead === 'true';
    if (req.query.type) filter.type = req.query.type;

    const [notifications, total, unreadCount] = await Promise.all([
      Notification.find(filter)
        .populate('sender', 'firstName lastName avatar')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Notification.countDocuments(filter),
      Notification.countDocuments({ recipient: req.user._id, isRead: false }),
    ]);

    return res.status(200).json({
      success: true,
      message: 'Notifications retrieved.',
      data: notifications,
      pagination: { total, page, limit, pages: Math.ceil(total / limit) },
      unreadCount,
    });
  } catch (error) {
    next(error);
  }
};

const markAsRead = async (req, res, next) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, recipient: req.user._id },
      { isRead: true, readAt: new Date() },
      { new: true }
    );
    if (!notification) return res.status(404).json({ success: false, message: 'Notification not found.' });
    return successResponse(res, 'Notification marked as read.', { notification });
  } catch (error) {
    next(error);
  }
};

const markAllAsRead = async (req, res, next) => {
  try {
    await Notification.updateMany(
      { recipient: req.user._id, isRead: false },
      { isRead: true, readAt: new Date() }
    );
    return successResponse(res, 'All notifications marked as read.');
  } catch (error) {
    next(error);
  }
};

const deleteNotification = async (req, res, next) => {
  try {
    const notification = await Notification.findOneAndDelete({
      _id: req.params.id,
      recipient: req.user._id,
    });
    if (!notification) return res.status(404).json({ success: false, message: 'Notification not found.' });
    return successResponse(res, 'Notification deleted.');
  } catch (error) {
    next(error);
  }
};

const clearAllNotifications = async (req, res, next) => {
  try {
    await Notification.deleteMany({ recipient: req.user._id });
    return successResponse(res, 'All notifications cleared.');
  } catch (error) {
    next(error);
  }
};

const sendNotification = async (req, res, next) => {
  try {
    const { title, message, type, recipientIds, link } = req.body;
    const notifications = recipientIds.map((recipientId) => ({
      title,
      message,
      type: type || 'info',
      recipient: recipientId,
      sender: req.user._id,
      link,
    }));
    await Notification.insertMany(notifications);
    return successResponse(res, `Notification sent to ${recipientIds.length} users.`, {}, 201);
  } catch (error) {
    next(error);
  }
};

module.exports = { getNotifications, markAsRead, markAllAsRead, deleteNotification, clearAllNotifications, sendNotification };
