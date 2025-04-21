const userModel = require("../../models/usersModel/usersModel.js");
const bookModel = require("../../models/booksModel/booksModel.js");
const ratingModel = require("../../models/ratingModel/ratingModel.js");

module.exports = {
  // Create a rating for a book by a user
  async createRatingService(body) {
    try {
      // Check if userId is provided in the request body
      if (!body.userId) {
        return {
          status: 404,
          error: true,
          message: "User ID not Provided",
          data: null,
        };
      }

      // Check if bookId is provided in the request body
      if (!body.bookId) {
        return {
          status: 404,
          error: true,
          message: "Book ID not Provided",
          data: null,
        };
      }

      // Check if ratings value is provided
      if (!body.ratings) {
        return {
          status: 404,
          error: true,
          message: "Rating not Provided",
          data: null,
        };
      }

      // Check if the user exists and is active
      const userExists = await userModel.findOne({
        _id: body.userId,
        isActive: true,
      });
      if (!userExists) {
        return {
          status: 400,
          error: true,
          message: "User Doesn't Exist",
          data: null,
        };
      }

      // Check if the book exists and is active
      const bookExists = await bookModel.findOne({
        _id: body.bookId,
        isActive: true,
      });
      if (!bookExists) {
        return {
          status: 400,
          error: true,
          message: "Book Doesn't Exist",
          data: null,
        };
      }

      // Create a new rating
      const crtRating = await ratingModel.create({
        bookId: body.bookId,
        userId: body.userId,
        ratings: body.ratings,
      });

      // Return success or failure message based on the result of creating the rating
      if (crtRating) {
        return {
          status: 200,
          error: false,
          message: "Created the Rating",
          data: crtRating,
        };
      } else {
        return {
          status: 400,
          error: true,
          message: "Failed to Create Rating",
          data: null,
        };
      }
    } catch (error) {
      // Handle any errors during the execution of the service
      console.log("Create Rating Service Failed", error);
      return {
        status: 400,
        error: true,
        message: "Create Rating Service Failed",
        data: null,
      };
    }
  },

  // Get all ratings
  async getAllRatingService() {
    try {
      const allRatings = await ratingModel
        .find({ isActive: true })
        .populate("userId")
        .populate("bookId");
      
      // Check if there are any ratings available
      if (allRatings.length > 0) {
        return {
          status: 200,
          error: false,
          message: "List of all the ratings",
          data: allRatings,
        };
      } else {
        return {
          status: 200,
          error: true,
          message: "No Ratings Found",
          data: null,
        };
      }
    } catch (error) {
      // Handle errors while fetching ratings
      console.log("Get All Rating Service Failed", error);
      return {
        status: 400,
        error: true,
        message: "Get All Rating Service Failed",
        data: null,
      };
    }
  },

  // Get ratings by a specific user ID
  async getByUsersIdRatingService(id) {
    try {
      // Check if user ID is provided
      if (!id) {
        return {
          status: 404,
          error: true,
          message: "User ID not provided",
          data: null,
        };
      }

      const ratings = await ratingModel
        .find({
          userId: id,
          isActive: true,
        })
        .populate("userId")
        .populate("bookId");

      // Return the ratings if found
      if (ratings.length > 0) {
        return {
          status: 200,
          error: false,
          message: "Ratings by User ID",
          data: ratings,
        };
      } else {
        return {
          status: 200,
          error: true,
          message: "No Ratings Found for this User",
          data: null,
        };
      }
    } catch (error) {
      // Handle errors while fetching ratings by user ID
      console.log("Get By User ID Rating Service Failed", error);
      return {
        status: 400,
        error: true,
        message: "Get By User ID Rating Service Failed",
        data: null,
      };
    }
  },

  // Get ratings by a specific book ID
  async getByBookIdRatingService(id) {
    try {
      // Check if book ID is provided
      if (!id) {
        return {
          status: 404,
          error: true,
          message: "Book ID not provided",
          data: null,
        };
      }

      const ratings = await ratingModel
        .find({
          bookId: id,
          isActive: true,
        })
        .populate("userId")
        .populate("bookId");

      // Return the ratings if found
      if (ratings.length > 0) {
        return {
          status: 200,
          error: false,
          message: "Ratings by Book ID",
          data: ratings,
        };
      } else {
        return {
          status: 200,
          error: true,
          message: "No Ratings Found for this Book",
          data: null,
        };
      }
    } catch (error) {
      // Handle errors while fetching ratings by book ID
      console.log("Get By Book ID Rating Service Failed", error);
      return {
        status: 400,
        error: true,
        message: "Get By Book ID Rating Service Failed",
        data: null,
      };
    }
  },

  // Delete a rating
  async delRatingService(id) {
    try {
      // Check if rating ID is provided
      if (!id) {
        return {
          status: 404,
          error: true,
          message: "Rating ID not provided",
          data: null,
        };
      }

      // Set the rating as inactive and deleted
      const deletedRating = await ratingModel.findOneAndUpdate(
        { _id: id, isActive: true },
        { isActive: false, isDeleted: true, status: false },
        { new: true }
      );

      // Return the result of the delete operation
      if (deletedRating) {
        return {
          status: 200,
          error: false,
          message: "Rating deleted successfully",
          data: deletedRating,
        };
      } else {
        return {
          status: 404,
          error: true,
          message: "Rating not found or already deleted",
          data: null,
        };
      }
    } catch (error) {
      // Handle errors while deleting the rating
      console.log("Delete Rating Service Failed", error);
      return {
        status: 400,
        error: true,
        message: "Delete Rating Service Failed",
        data: null,
      };
    }
  },

  // Get the average rating for a book
  async getBookAverageRatingService(id) {
    try {
      // Check if book ID is provided
      if (!id) {
        return {
          status: 404,
          error: true,
          message: "Book ID not provided",
          data: null,
        };
      }

      const ratings = await ratingModel.find({
        bookId: id,
        isActive: true,
      });

      // Calculate the average rating if there are any ratings
      if (ratings.length > 0) {
        const ratingSum = ratings.reduce(
          (sum, item) => sum + parseFloat(item.ratings),
          0
        );
        const averageRating = ratingSum / ratings.length;

        return {
          status: 200,
          error: false,
          message: "Book Average Rating",
          data: {
            averageRating,
            totalRatings: ratings.length,
          },
        };
      } else {
        return {
          status: 200,
          error: true,
          message: "No Ratings Found for this Book",
          data: {
            averageRating: 0,
            totalRatings: 0,
          },
        };
      }
    } catch (error) {
      // Handle errors while calculating the average rating
      console.log("Get Book Average Rating Service Failed", error);
      return {
        status: 400,
        error: true,
        message: "Get Book Average Rating Service Failed",
        data: null,
      };
    }
  },
};
