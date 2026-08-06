const express = require("express");

const router = express.Router();

const userController = require("../controllers/userController");
const { protect, authorize } = require("../middleware/auth");

router.use(protect);
router.use(authorize("super_admin", "admin"));

router.get("/", userController.getUsers);
router.post("/", userController.createUser);
router.get("/:id", userController.getUser);
router.put("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);
router.patch("/:id/status", userController.toggleUserStatus);
router.patch("/:id/role", userController.updateUserRole);

module.exports = router;
