const express = require("express");
const multerMiddleware = require("../../middleware/multer.middleware");
const authControllers = require("../../controllers/authControllers/authControllers");
const router = express.Router();

// Route for user registration with image upload
router.post(
  "/register",
  multerMiddleware.single("userImg"), // Handle user image upload
  authControllers.registerUserController // Controller to process registration
);

// Route for user login
router.post("/login", authControllers.loginUserController);

module.exports = router;
