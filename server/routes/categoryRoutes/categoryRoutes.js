const express = require("express");
const router = express.Router();
const categoryController = require("../../controllers/categoryControllers/categoryControllers.js");

// Get all categories
router.get("/src/all", categoryController.getAllCategoryController);

// Get a category by its ID
router.get("/srcById/:id", categoryController.getSingleCategoryController);

// Remove a category by its ID
router.get("/rmv/:id", categoryController.removeSingleCategoryController);

// Update a category by its ID
router.post("/upt/:id", categoryController.updateSingleCategoryController);

// Create a new category
router.post("/crt", categoryController.createCategoryController);

module.exports = router;
