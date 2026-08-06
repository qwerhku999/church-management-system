const express = require("express");

const router = express.Router();

const notificationController = require("../controllers/notificationController");
const { protect, authorize } = require("../middleware/auth");

// =====================================
// All notification routes require login
// =====================================

router.use(protect);

// =====================================
// GET Notifications
// GET /api/notifications
// =====================================

router.get("/", notificationController.getNotifications);

// =====================================
// Mark All As Read
// PATCH /api/notifications/read-all
// =====================================

router.patch("/read-all", notificationController.markAllAsRead);

// =====================================
// Clear All Notifications
// DELETE /api/notifications/clear
// =====================================

router.delete("/clear", notificationController.clearAllNotifications);

// =====================================
// Send Notification
// POST /api/notifications/send
// =====================================

router.post(
  "/send",
  authorize("super_admin", "admin", "pastor"),
  notificationController.sendNotification
);

// =====================================
// Mark Single Notification Read
// PATCH /api/notifications/:id/read
// =====================================

router.patch("/:id/read", notificationController.markAsRead);

// =====================================
// Delete Single Notification
// DELETE /api/notifications/:id
// =====================================

router.delete("/:id", notificationController.deleteNotification);

module.exports = router;
