const express = require("express");
const userControllers = require("../../controllers/userControllers/userControllers");
const router = express.Router();

// Get all users
router.get("/src/all", userControllers.getAllUsersControllers);

// Get a user by their ID
router.get("/srcById/:id", userControllers.getUserByIdControllers);

// Delete a user by their ID
router.get("/delById/:id", userControllers.deleteUserByIdControllers)

module.exports = router;
