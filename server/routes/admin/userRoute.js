const express = require("express");
const router = express.Router();
const userController = require("../../controllers/admin/userController");

// GET /admin/users -> getAllUsers
router.get("/", userController.getAllUsers);

// POST /admin/users -> createUser
router.post("/", userController.createUser);

// GET /admin/users/:id -> getAUser
router.get("/:id", userController.getAUser);

// PUT /admin/users/:id -> updateUser
router.put("/:id", userController.updateUser);

// DELETE /admin/users/:id -> deleteUser
router.delete("/:id", userController.deleteUser);

module.exports = router;