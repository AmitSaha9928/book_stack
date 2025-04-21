const mongoose = require("mongoose");

// Define the schema for the Review collection
var reviewSchema = new mongoose.Schema(
  {
    // The ID of the user who submitted the review
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true, // A user must be associated with the review
      ref: "Users", // Reference to the Users collection
    },

    // The ID of the book being reviewed
    bookId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true, // A book must be reviewed
      ref: "Books", // Reference to the Books collection
    },

    // The content of the review
    reviews: {
      type: String,
      required: true, // Review content is mandatory
    },

    // Status of the review (active or not)
    status: {
      type: Boolean,
      default: true, // Default to active
    },

    // Whether the review is considered active for further use
    isActive: {
      type: Boolean,
      default: true, // Default to true
    },

    // Soft delete flag (marks the review as deleted without removing it from DB)
    isDeleted: {
      type: Boolean,
      default: false, // Default to false meaning the review is not deleted
    },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

// Export the Review model for use in other parts of the application
module.exports = mongoose.model("Reviews", reviewSchema);
