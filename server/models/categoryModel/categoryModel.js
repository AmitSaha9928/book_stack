const mongoose = require("mongoose");

// Define the schema for the Categories collection
let categorySchema = new mongoose.Schema(
  {
    // Name of the category (e.g., "Fiction", "Non-Fiction")
    categoryName: {
      type: String,
      required: true,
    },

    // Unique code for the category (used for reference or categorization)
    categoryCode: {
      type: String,
      required: true,
    },

    // Publication status (active/inactive category)
    status: {
      type: Boolean,
      default: true, // Default to true meaning the category is active
    },

    // Activation flag for internal use (system control)
    isActive: {
      type: Boolean,
      default: true, // Default to active
    },

    // Soft delete flag (marks the category as deleted without removing it)
    isDeleted: {
      type: Boolean,
      default: false, // Default to false meaning the category is not deleted
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Export the model for use in other parts of the app
module.exports = mongoose.model("Categories", categorySchema);
