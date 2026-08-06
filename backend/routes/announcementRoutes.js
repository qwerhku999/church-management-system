const express = require("express");

const router = express.Router();

const announcementController =
require("../controllers/announcementController");


const {
    protect,
    authorize
}=require("../middleware/auth");



router.use(protect);



router.get(
    "/",
    announcementController.getAnnouncements
);



router.get(
    "/:id",
    announcementController.getAnnouncement
);



router.post(
    "/",
    authorize(
        "super_admin",
        "admin",
        "pastor"
    ),
    announcementController.createAnnouncement
);



router.put(
    "/:id",
    authorize(
        "super_admin",
        "admin",
        "pastor"
    ),
    announcementController.updateAnnouncement
);



router.delete(
    "/:id",
    authorize(
        "super_admin",
        "admin"
    ),
    announcementController.deleteAnnouncement
);



module.exports = router;