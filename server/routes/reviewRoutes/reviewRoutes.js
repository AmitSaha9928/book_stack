const express = require("express");
const router = express.Router();
const reviewControllers = require("../../controllers/reviewControllers/reviewControllers.js");

// Create a new review
router.post("/crt", reviewControllers.crtReviewController);

// Get all reviews
router.get("/srcall", reviewControllers.getAllReviewController);

// Get reviews by book ID
router.get("/srcbyid/:id", reviewControllers.getReviewByBookIdController);

// Remove a review by ID
router.get("/rmv/:id", reviewControllers.removeReviewController);

module.exports = router;
