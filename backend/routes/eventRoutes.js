const express = require("express");

const router = express.Router();

const eventController = require("../controllers/eventController");
const { protect, authorize } = require("../middleware/auth");
const upload = require("../middleware/upload");

// All event routes require authentication
router.use(protect);

// Get all events
router.get("/", eventController.getEvents);

// Get calendar events
router.get("/calendar", eventController.getCalendarEvents);

// Get single event
router.get("/:id", eventController.getEvent);

// Create event
router.post(
  "/",
  authorize("super_admin", "admin", "pastor"),
  upload.single("image"),
  eventController.createEvent
);

// Update event
router.put(
  "/:id",
  authorize("super_admin", "admin", "pastor"),
  upload.single("image"),
  eventController.updateEvent
);

// Delete event
router.delete(
  "/:id",
  authorize("super_admin", "admin"),
  eventController.deleteEvent
);

// Register member for an event
router.post(
  "/:id/register",
  authorize("super_admin", "admin", "pastor", "ministry_leader", "volunteer", "member"),
  eventController.registerForEvent
);

module.exports = router;
