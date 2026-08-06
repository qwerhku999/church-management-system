const express = require("express");

const router = express.Router();

const visitorController = require("../controllers/visitorController");

const {
  protect,
  authorize,
} = require("../middleware/auth");


// =====================================
// All visitor routes require login
// =====================================

router.use(protect);


// =====================================
// GET Visitor Statistics
// GET /api/visitors/stats
// =====================================

router.get(
  "/stats",
  authorize(
    "super_admin",
    "admin",
    "pastor"
  ),
  visitorController.getVisitorStats
);


// =====================================
// GET All Visitors
// GET /api/visitors
// =====================================

router.get(
  "/",
  visitorController.getVisitors
);


// =====================================
// GET Single Visitor
// GET /api/visitors/:id
// =====================================

router.get(
  "/:id",
  visitorController.getVisitor
);


// =====================================
// CREATE Visitor
// POST /api/visitors
// =====================================

router.post(
  "/",
  authorize(
    "super_admin",
    "admin",
    "pastor",
    "secretary"
  ),
  visitorController.createVisitor
);


// =====================================
// UPDATE Visitor
// PUT /api/visitors/:id
// =====================================

router.put(
  "/:id",
  authorize(
    "super_admin",
    "admin",
    "pastor",
    "secretary"
  ),
  visitorController.updateVisitor
);


// =====================================
// Update Follow Up
// PATCH /api/visitors/:id/follow-up
// =====================================

router.patch(
  "/:id/follow-up",
  authorize(
    "super_admin",
    "admin",
    "pastor",
    "secretary"
  ),
  visitorController.updateFollowUp
);


// =====================================
// DELETE Visitor
// DELETE /api/visitors/:id
// =====================================

router.delete(
  "/:id",
  authorize(
    "super_admin",
    "admin"
  ),
  visitorController.deleteVisitor
);


module.exports = router;