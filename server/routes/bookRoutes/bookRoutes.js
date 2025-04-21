const express = require("express");
const multerMiddleware = require("../../middleware/multer.middleware");
const bookController = require("../../controllers/booksControllers/booksControllers.js");
const router = express.Router();

// Insert a new book with a thumbnail
router.post(
  "/insert",
  multerMiddleware.single("bookThumbnail"),
  bookController.insertBookController
);

// Get all books
router.get("/src/all", bookController.getAllBookController);

// Get recent books
router.get("/rcnt/src/all", bookController.getRecentBoosController);

// Get a book by its ID
router.get("/srcbyid/:id", bookController.getSingleBookByIdController);

// Get books by a specific user
router.get("/src/by/user/:id", bookController.getBookByUserIdController);

// Remove a book by its ID
router.get("/rmv/:id", bookController.rmvBookByIdController);

// Update book details by its ID
router.post("/upt/:id", bookController.uptBookByIdController);

module.exports = router;
