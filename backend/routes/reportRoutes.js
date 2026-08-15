const express = require("express");

const router = express.Router();

const reportController = require("../controllers/reportController");

const {
    protect,
    authorize,
} = require("../middleware/auth");

router.use(protect);

// Members

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
    "/members/pdf",
    authorize(
        "super_admin",
        "admin",
        "pastor"
    ),
    reportController.downloadMemberReportPdf
);

// Attendance

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
    "/attendance/pdf",
    authorize(
        "super_admin",
        "admin",
        "pastor"
    ),
    reportController.downloadAttendanceReportPdf
);

// Finance

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
    "/finance/pdf",
    authorize(
        "super_admin",
        "admin",
        "treasurer",
        "finance_officer"
    ),
    reportController.downloadFinanceReportPdf
);

// Overview

router.get(
    "/overview",
    authorize(
        "super_admin",
        "admin",
        "pastor"
    ),
    reportController.getOverviewReport
);

router.get(
    "/overview/pdf",
    authorize(
        "super_admin",
        "admin",
        "pastor"
    ),
    reportController.downloadOverviewReportPdf
);

module.exports = router;