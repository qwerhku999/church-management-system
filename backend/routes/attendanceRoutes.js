const express = require("express");

const router = express.Router();

const {
  getAttendance,
  getAttendanceById,
  getAttendanceStats,
  createAttendance,
  updateAttendance,
  deleteAttendance,
} = require("../controllers/attendanceController");

const {
  protect,
  authorize,
} = require("../middleware/auth");


// =====================================
// All attendance routes require login
// =====================================

router.use(protect);



// =====================================
// GET Attendance Statistics
// GET /api/attendance/stats
// =====================================

router.get(
  "/stats",
  authorize(
    "super_admin",
    "admin",
    "pastor"
  ),
  getAttendanceStats
);



// =====================================
// GET All Attendance Records
// GET /api/attendance
// =====================================

router.get(
  "/",
  getAttendance
);



// =====================================
// GET Single Attendance Record
// GET /api/attendance/:id
// =====================================

router.get(
  "/:id",
  getAttendanceById
);



// =====================================
// CREATE Attendance Record
// POST /api/attendance
// =====================================

router.post(
  "/",
  authorize(
    "super_admin",
    "admin",
    "pastor",
    "secretary"
  ),
  createAttendance
);



// =====================================
// UPDATE Attendance Record
// PUT /api/attendance/:id
// =====================================

router.put(
  "/:id",
  authorize(
    "super_admin",
    "admin",
    "pastor",
    "secretary"
  ),
  updateAttendance
);



// =====================================
// PATCH Attendance Record
// PATCH /api/attendance/:id
// =====================================

router.patch(
  "/:id",
  authorize(
    "super_admin",
    "admin",
    "pastor",
    "secretary"
  ),
  updateAttendance
);



// =====================================
// DELETE Attendance Record
// DELETE /api/attendance/:id
// =====================================

router.delete(
  "/:id",
  authorize(
    "super_admin",
    "admin"
  ),
  deleteAttendance
);



module.exports = router;