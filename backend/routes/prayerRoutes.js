const express = require("express");

const router = express.Router();

const prayerController = require("../controllers/prayerController");

const {
  protect,
  authorize
} = require("../middleware/auth");


// =====================================
// All prayer routes require login
// =====================================

router.use(protect);



// =====================================
// GET ALL PRAYER REQUESTS
// GET /api/prayers
// =====================================

router.get(
  "/",
  prayerController.getPrayerRequests
);



// =====================================
// GET SINGLE PRAYER REQUEST
// GET /api/prayers/:id
// =====================================

router.get(
  "/:id",
  prayerController.getPrayerRequest
);



// =====================================
// CREATE PRAYER REQUEST
// POST /api/prayers
// =====================================

router.post(
  "/",
  prayerController.createPrayerRequest
);



// =====================================
// UPDATE PRAYER REQUEST
// PUT /api/prayers/:id
// =====================================

router.put(
  "/:id",
  authorize(
    "super_admin",
    "admin",
    "pastor"
  ),
  prayerController.updatePrayerRequest
);



// =====================================
// DELETE PRAYER REQUEST
// DELETE /api/prayers/:id
// =====================================

router.delete(
  "/:id",
  authorize(
    "super_admin",
    "admin"
  ),
  prayerController.deletePrayerRequest
);



// =====================================
// PRAY FOR REQUEST
// POST /api/prayers/:id/pray
// =====================================

router.post(
  "/:id/pray",
  prayerController.prayForRequest
);



// =====================================
// ADD UPDATE
// POST /api/prayers/:id/update
// =====================================

router.post(
  "/:id/update",
  authorize(
    "super_admin",
    "admin",
    "pastor"
  ),
  prayerController.addUpdate
);



module.exports = router;