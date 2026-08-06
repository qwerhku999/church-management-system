const express = require("express");

const router = express.Router();

const financeController = require("../controllers/financeController");

const {
    protect,
    authorize
} = require("../middleware/auth");


router.use(protect);


// Get all transactions

router.get(
    "/",
    authorize(
        "super_admin",
        "admin",
        "treasurer",
        "finance_officer"
    ),
    financeController.getTransactions
);


// Finance summary

router.get(
    "/summary",
    authorize(
        "super_admin",
        "admin",
        "treasurer",
        "finance_officer"
    ),
    financeController.getFinanceSummary
);


// Monthly report

router.get(
    "/monthly",
    authorize(
        "super_admin",
        "admin",
        "treasurer",
        "finance_officer"
    ),
    financeController.getMonthlyReport
);


// Create transaction

router.post(
    "/",
    authorize(
        "super_admin",
        "admin",
        "treasurer",
        "finance_officer"
    ),
    financeController.createTransaction
);


// Update transaction

router.put(
    "/:id",
    authorize(
        "super_admin",
        "admin",
        "treasurer"
    ),
    financeController.updateTransaction
);


// Delete transaction

router.delete(
    "/:id",
    authorize(
        "super_admin",
        "admin"
    ),
    financeController.deleteTransaction
);


module.exports = router;