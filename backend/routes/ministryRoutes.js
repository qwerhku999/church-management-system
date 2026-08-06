const express = require("express");

const router = express.Router();

const ministryController = require("../controllers/ministryController");

const {
  protect,
  authorize
} = require("../middleware/auth");


// All ministry routes require authentication
router.use(protect);


// =====================================
// GET ALL MINISTRIES
// GET /api/ministries
// =====================================

router.get(
  "/",
  ministryController.getMinistries
);


// =====================================
// GET SINGLE MINISTRY
// GET /api/ministries/:id
// =====================================

router.get(
  "/:id",
  ministryController.getMinistry
);


// =====================================
// CREATE MINISTRY
// POST /api/ministries
// =====================================

router.post(
  "/",
  authorize(
    "super_admin",
    "admin",
    "pastor",
    "ministry_leader"
  ),
  ministryController.createMinistry
);


// =====================================
// UPDATE MINISTRY
// PUT /api/ministries/:id
// =====================================

router.put(
  "/:id",
  authorize(
    "super_admin",
    "admin",
    "pastor"
  ),
  ministryController.updateMinistry
);


// =====================================
// DELETE MINISTRY
// DELETE /api/ministries/:id
// =====================================

router.delete(
  "/:id",
  authorize(
    "super_admin",
    "admin"
  ),
  ministryController.deleteMinistry
);


// =====================================
// ADD MEMBER TO MINISTRY
// POST /api/ministries/:id/members
// =====================================

router.post(
  "/:id/members",
  authorize(
    "super_admin",
    "admin",
    "pastor",
    "ministry_leader"
  ),
  ministryController.addMember
);


// =====================================
// REMOVE MEMBER FROM MINISTRY
// DELETE /api/ministries/:id/members/:memberId
// =====================================

router.delete(
  "/:id/members/:memberId",
  authorize(
    "super_admin",
    "admin",
    "pastor",
    "ministry_leader"
  ),
  ministryController.removeMember
);


module.exports = router;