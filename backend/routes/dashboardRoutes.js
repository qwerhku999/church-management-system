const express = require("express");

const router = express.Router();


const {
  protect,
  authorize
} = require("../middleware/auth");


const {
  getDashboard
} = require("../controllers/dashboardController");





router.use(protect);





router.get(
  "/",
  authorize(
    "super_admin",
    "admin",
    "pastor"
  ),
  getDashboard
);





module.exports = router;