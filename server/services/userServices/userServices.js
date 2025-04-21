const userModel = require("../../models/usersModel/usersModel.js");

module.exports = {
  // Service to retrieve all active users who are not marked as deleted
  async getAllUserService() {
    try {
      // Find all users who are active and not deleted
      const users = await userModel.find({ isActive: true, isDeleted: false });

      // Check if users are found and return appropriate response
      if (users) {
        return {
          status: 200,
          error: false,
          data: users,
          message: "Get All Users Success",
        };
      } else {
        // No users found
        return {
          status: 404,
          error: true,
          message: "No Users Found",
          data: null,
        };
      }
    } catch (error) {
      // Handle any errors during the process
      console.log("Get All User Service Error", error);
      return {
        status: 400,
        error: true,
        message: "Get All User Service Error",
        data: null,
      };
    }
  },

  // Service to retrieve details of a single user by their ID
  async getSingleUserDetailsService(id) {
    try {
      // Find a specific user by their ID, ensuring they are active and not deleted
      const user = await userModel.findOne({
        _id: id,
        isActive: true,
        isDeleted: false,
      });

      // Check if the user is found
      if (!user) {
        return {
          status: 404,
          error: false,
          message: "User Not Found",
          data: null,
        };
      }

      // Return the user details if found
      return {
        status: 200,
        error: false,
        message: "User Found",
        data: user,
      };
    } catch (error) {
      // Handle any errors while retrieving user details
      console.log("Get Single User Service Error", error);
      return {
        status: 400,
        error: true,
        data: null,
        message: "Get Single User Service Error",
      };
    }
  },

  // Service to remove a user by marking them as inactive and deleted
  async removeSingleUserService(id) {
    try {
      // Find the user to ensure they are active before removal
      const user = await userModel.findOne({ _id: id, isActive: true });

      // If the user is not found
      if (!user) {
        return {
          status: 404,
          error: false,
          message: "User Not Found",
          data: null,
        };
      }

      // Mark the user as inactive and deleted
      const rmvUser = await userModel.findOneAndUpdate(
        { _id: id },
        { isActive: false, isDeleted: true, status: false },
        { new: true }
      );

      // Return a success or failure message based on the result
      if (rmvUser) {
        return {
          status: 200,
          error: false,
          message: "User removed successfully",
          data: null,
        };
      } else {
        return {
          status: 400,
          error: true,
          message: "Failed to remove the user",
          data: null,
        };
      }
    } catch (error) {
      // Handle any errors during the removal process
      console.log("Remove Single User Service Error", error);
      return {
        status: 500,
        error: true,
        message: "Remove Single User Service Error",
        data: null,
      };
    }
  },
};
