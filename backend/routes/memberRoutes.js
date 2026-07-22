const express = require("express");
const router = express.Router();

const memberController = require("../controllers/memberController");

const {
  createMemberValidator,
  updateMemberValidator,
  memberIdValidator,
} = require("../validators/memberValidators");

const { protect, authorize } = require("../middleware/auth");
const upload = require("../middleware/upload");
const validate = require("../middleware/validate");

// All member routes require authentication
router.use(protect);

// Get all members
router.get("/", memberController.getMembers);

// Member statistics
router.get(
  "/stats",
  authorize("super_admin", "admin", "pastor"),
  memberController.getMemberStats
);

// Get one member
router.get(
  "/:id",
  memberIdValidator,
  validate,
  memberController.getMember
);

// Create member
router.post(
  "/",
  authorize("super_admin", "admin", "pastor", "secretary"),
  upload.single("avatar"),
  createMemberValidator,
  validate,
  memberController.createMember
);

// Update member
router.put(
  "/:id",
  authorize("super_admin", "admin", "pastor", "secretary"),
  upload.single("avatar"),
  updateMemberValidator,
  validate,
  memberController.updateMember
);

// Delete member
router.delete(
  "/:id",
  authorize("super_admin", "admin"),
  memberIdValidator,
  validate,
  memberController.deleteMember
);

module.exports = router;