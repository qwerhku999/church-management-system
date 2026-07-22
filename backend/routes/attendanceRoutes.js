const express = require("express");

const router = express.Router();

const attendanceController = require("../controllers/attendanceController");

const { protect, authorize } = require("../middleware/auth");


// All attendance routes require authentication
router.use(protect);


// GET all attendance records
router.get(
  "/",
  attendanceController.getAttendance
);


// GET attendance statistics
router.get(
  "/stats",
  authorize("super_admin", "admin", "pastor"),
  attendanceController.getAttendanceStats
);


// GET single attendance record
router.get(
  "/:id",
  attendanceController.getAttendanceRecord
);


// CREATE attendance record
router.post(
  "/",
  authorize("super_admin", "admin", "pastor", "secretary"),
  attendanceController.createAttendance
);


// UPDATE attendance record
router.put(
  "/:id",
  authorize("super_admin", "admin", "pastor", "secretary"),
  attendanceController.updateAttendance
);


// DELETE attendance record
router.delete(
  "/:id",
  authorize("super_admin", "admin"),
  attendanceController.deleteAttendance
);


module.exports = router;