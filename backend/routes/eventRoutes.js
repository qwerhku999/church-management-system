const express = require("express");

const router = express.Router();

const eventController = require("../controllers/eventController");

const {
  protect,
  authorize,
} = require("../middleware/auth");

const upload = require("../middleware/upload");

// =====================================
// All event routes require authentication
// =====================================

router.use(protect);

// =====================================
// Get all events
// GET /api/events
// =====================================

router.get(
  "/",
  eventController.getEvents
);

// =====================================
// Calendar events
// GET /api/events/calendar
// =====================================

router.get(
  "/calendar",
  eventController.getCalendarEvents
);

// =====================================
// Publish event
// PATCH /api/events/:id/publish
// =====================================

router.patch(
  "/:id/publish",
  authorize(
    "super_admin",
    "admin",
    "pastor"
  ),
  eventController.publishEvent
);

// =====================================
// Get single event
// GET /api/events/:id
// =====================================

router.get(
  "/:id",
  eventController.getEvent
);

// =====================================
// Create event
// POST /api/events
// =====================================

router.post(
  "/",
  authorize(
    "super_admin",
    "admin",
    "pastor"
  ),
  upload.single("image"),
  eventController.createEvent
);

// =====================================
// Update event
// PUT /api/events/:id
// =====================================

router.put(
  "/:id",
  authorize(
    "super_admin",
    "admin",
    "pastor"
  ),
  upload.single("image"),
  eventController.updateEvent
);

// =====================================
// Delete / cancel event
// DELETE /api/events/:id
// =====================================

router.delete(
  "/:id",
  authorize(
    "super_admin",
    "admin"
  ),
  eventController.deleteEvent
);

// =====================================
// Register member for event
// POST /api/events/:id/register
// =====================================

router.post(
  "/:id/register",
  authorize(
    "super_admin",
    "admin",
    "pastor",
    "ministry_leader",
    "volunteer",
    "member"
  ),
  eventController.registerForEvent
);

module.exports = router;