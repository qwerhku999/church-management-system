const express = require("express");

const router = express.Router();

const reportController =
require("../controllers/reportController");

const {
    protect,
    authorize
}=require("../middleware/auth");



router.use(protect);



router.get(
    "/members",
    authorize(
        "super_admin",
        "admin",
        "pastor"
    ),
    reportController.getMemberReport
);



router.get(
    "/attendance",
    authorize(
        "super_admin",
        "admin",
        "pastor"
    ),
    reportController.getAttendanceReport
);



router.get(
    "/finance",
    authorize(
        "super_admin",
        "admin",
        "treasurer",
        "finance_officer"
    ),
    reportController.getFinanceReport
);



router.get(
    "/overview",
    authorize(
        "super_admin",
        "admin",
        "pastor"
    ),
    reportController.getOverviewReport
);



module.exports = router;