const express = require("express");
const router = express.Router();
const ratingController = require("../../controllers/ratingControllers/ratingControllers.js");

// Create a new rating
router.post("/crt", ratingController.crtRatingController);

// Get all ratings
router.get("/srcall", ratingController.getAllRatingController);

// Get ratings by user ID
router.get("/srcbyusrid/:id", ratingController.getRatingByUserIdController);

// Get ratings by book ID
router.get("/srcbybookid/:id", ratingController.getRatingByBookIdController);

// Remove a rating by ID
router.get("/rmv/:id", ratingController.removeRatingController);

// Get the average rating of a book
router.get("/average/:id", ratingController.getBookAverageRatingController);

module.exports = router;
