const mongoose = require("mongoose");

// Define the schema for the User collection
let userSchema = new mongoose.Schema(
  {
    // User's first name
    firstName: {
      type: String,
      required: true, // First name is mandatory
    },

    // User's last name
    lastName: {
      type: String,
      required: true, // Last name is mandatory
    },

    // Unique username chosen by the user
    username: {
      type: String,
      required: true, // Username is mandatory
    },

    // User's email address (used for registration/login)
    email: {
      type: String,
      required: true, // Email is mandatory
    },

    // User's phone number (can be used for contact)
    phoneNumber: {
      type: String,
      required: true, // Phone number is mandatory
    },

    // User's role, represented by a number (e.g., 1 for admin, 2 for user)
    userRole: {
      type: Number,
      required: true, // Role is mandatory
    },

    // Encrypted password for user authentication
    password: {
      type: String,
      required: true, // Password is mandatory
    },

    // User's profile image URL or path
    userImg: {
      type: String,
      required: true, // Profile image is mandatory
    },

    // Status of the user (active or inactive)
    status: {
      type: Boolean,
      default: true, // Default to active
    },

    // Whether the user is currently active or not
    isActive: {
      type: Boolean,
      default: true, // Default to true (active)
    },

    // Soft delete flag to mark the user as deleted without removing from DB
    isDeleted: {
      type: Boolean,
      default: false, // Default to false meaning the user is not deleted
    },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

// Export the User model for use in other parts of the application
module.exports = mongoose.model("Users", userSchema);
