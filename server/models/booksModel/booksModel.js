const mongoose = require("mongoose");

// Define the schema for the Books collection
let booksSchema = new mongoose.Schema(
  {
    // Title of the book
    bookTitle: {
      type: String,
      required: true,
    },

    // Optional summary or description of the book
    bookSummary: {
      type: String,
      required: false,
    },

    // Price of the book
    bookPrice: {
      type: Number,
      required: true,
    },

    // Total number of pages
    amountOfPage: {
      type: Number,
      required: true,
    },

    // Name of the author
    authorName: {
      type: String,
      required: true,
    },

    // ID of the user who inserted this book
    insertionUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Users", // Reference to Users collection
    },

    // ID of the category this book belongs to
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Categories", // Reference to Categories collection
    },

    // Image path or URL of the book cover
    bookImg: {
      type: String,
      required: true,
    },

    // Publication status (published/unpublished)
    status: {
      type: Boolean,
      default: true,
    },

    // Activation flag (for system use)
    isActive: {
      type: Boolean,
      default: true,
    },

    // Deletion flag (soft delete handling)
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

// Export the model to use in other parts of the app
module.exports = mongoose.model("Books", booksSchema);
