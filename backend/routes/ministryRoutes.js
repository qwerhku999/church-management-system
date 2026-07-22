const express = require("express");

const router = express.Router();

const ministryController = require("../controllers/ministryController");
const { protect, authorize } = require("../middleware/auth");
const upload = require("../middleware/upload");


// All ministry routes require authentication
router.use(protect);


// Get all ministries
router.get(
  "/",
  ministryController.getMinistries
);


// Get single ministry
router.get(
  "/:id",
  ministryController.getMinistry
);


// Create ministry
router.post(
  "/",
  authorize("super_admin", "admin", "pastor"),
  upload.single("image"),
  ministryController.createMinistry
);


// Update ministry
router.put(
  "/:id",
  authorize("super_admin", "admin", "pastor"),
  upload.single("image"),
  ministryController.updateMinistry
);


// Delete ministry
router.delete(
  "/:id",
  authorize("super_admin", "admin"),
  ministryController.deleteMinistry
);


// Add member to ministry
router.post(
  "//:id/members",
  authorize("super_admin", "admin", "pastor", "ministry_leader"),
  ministryController.addMember
);


// Remove member from ministry
router.delete(
  "//:id/members/:memberId",
  authorize("super_admin", "admin", "pastor", "ministry_leader"),
  ministryController.removeMember
);


module.exports = router;