const express = require("express");
const router = express.Router();
const userController = require("../../controllers/admin/userController");
const adminMiddleware = require("../../middlewares/adminMiddleware");

// GET /admin/users -> getAllUsers
router.get("/", adminMiddleware, userController.getAllUsers);

// POST /admin/users -> createUser
router.post("/", adminMiddleware, userController.createUser);

// GET /admin/users/:id -> getAUser
router.get("/:id", userController.getAUser);

// PUT /admin/users/:id -> updateUser
router.put("/:id", adminMiddleware, userController.updateUser);

// DELETE /admin/users/:id -> deleteUser
router.delete("/:id", adminMiddleware, userController.deleteUser);

module.exports = router;