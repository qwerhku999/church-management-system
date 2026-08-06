const express = require("express");

const router = express.Router();

const donationController = require("../controllers/donationController");
const { protect, authorize } = require("../middleware/auth");


// =====================================
// All donation routes require login
// =====================================

router.use(protect);


// =====================================
// GET All Donations
// GET /api/donations
// =====================================

router.get(
  "/",
  donationController.getDonations
);


// =====================================
// GET Donation Summary
// GET /api/donations/summary
// =====================================

router.get(
  "/summary",
  authorize(
    "super_admin",
    "admin",
    "pastor",
    "treasurer",
    "finance_officer"
  ),
  donationController.getDonationSummary
);


// =====================================
// GET Monthly Donation Trend
// GET /api/donations/monthly-trend
// =====================================

router.get(
  "/monthly-trend",
  authorize(
    "super_admin",
    "admin",
    "pastor",
    "treasurer",
    "finance_officer"
  ),
  donationController.getMonthlyTrend
);


// =====================================
// GET Single Donation
// GET /api/donations/:id
// =====================================

router.get(
  "/:id",
  donationController.getDonation
);


// =====================================
// CREATE Donation
// POST /api/donations
// =====================================

router.post(
  "/",
  authorize(
    "super_admin",
    "admin",
    "pastor",
    "treasurer",
    "finance_officer",
    "secretary"
  ),
  donationController.createDonation
);


// =====================================
// UPDATE Donation
// PUT /api/donations/:id
// =====================================

router.put(
  "/:id",
  authorize(
    "super_admin",
    "admin",
    "treasurer",
    "finance_officer"
  ),
  donationController.updateDonation
);


// =====================================
// DELETE Donation
// DELETE /api/donations/:id
// =====================================

router.delete(
  "/:id",
  authorize(
    "super_admin",
    "admin"
  ),
  donationController.deleteDonation
);


module.exports = router;