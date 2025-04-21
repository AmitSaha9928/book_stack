const mongoose = require("mongoose");

// Define the schema for the Rating collection
var ratingSchema = new mongoose.Schema(
  {
    // The ID of the user who gave the rating
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true, // The user is required to submit a rating
      ref: "Users", // Reference to the Users collection
    },

    // The ID of the book being rated
    bookId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true, // A book must be rated
      ref: "Books", // Reference to the Books collection
    },

    // The rating value (could be a number, but using string here)
    ratings: {
      type: String,
      required: true, // Rating is mandatory
    },

    // Status of the rating (active or not)
    status: {
      type: Boolean,
      default: true, // Default to active
    },

    // Whether the rating is considered active for further use
    isActive: {
      type: Boolean,
      default: true, // Default to true
    },

    // Soft delete flag (marks the rating as deleted without removing it from DB)
    isDeleted: {
      type: Boolean,
      default: false, // Default to false meaning the rating is not deleted
    },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

// Export the Rating model for use in other parts of the application
module.exports = mongoose.model("Rating", ratingSchema);
