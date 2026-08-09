const express = require("express");

const router = express.Router();

const userController = require("../controllers/userController");
const { protect, authorize } = require("../middleware/auth");

router.use(protect);

/*
 * User management is available to both
 * Super Admin and Admin.
 */
router.get(
    "/",
    authorize("super_admin", "admin"),
    userController.getUsers
);

router.post(
    "/",
    authorize("super_admin", "admin"),
    userController.createUser
);

router.get(
    "/:id",
    authorize("super_admin", "admin"),
    userController.getUser
);

router.put(
    "/:id",
    authorize("super_admin", "admin"),
    userController.updateUser
);

router.delete(
    "/:id",
    authorize("super_admin", "admin"),
    userController.deleteUser
);

router.patch(
    "/:id/status",
    authorize("super_admin", "admin"),
    userController.toggleUserStatus
);

/*
 * IMPORTANT:
 * Only Super Admin can promote/demote users.
 */
router.patch(
    "/:id/role",
    authorize("super_admin"),
    userController.updateUserRole
);

module.exports = router;