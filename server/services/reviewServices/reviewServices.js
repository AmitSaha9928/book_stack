const reviewModel = require("../../models/reviewModel/reviewModel.js");
const userModel = require("../../models/usersModel/usersModel.js");
const bookModel = require("../../models/booksModel/booksModel.js");

module.exports = {
  // Service to create a new review
  async crtReviewSrvc(body) {
    try {
      // Check if userId is provided in the request body
      if (!body.userId) {
        return {
          status: 404,
          error: true,
          message: "User Id MIssing",
          data: null,
        };
      }

      // Check if bookId is provided in the request body
      if (!body.bookId) {
        return {
          status: 404,
          error: true,
          message: "Book ID Missing",
          data: null,
        };
      }

      // Check if reviews field is provided
      if (!body.reviews) {
        return {
          status: 404,
          error: true,
          message: "Review Missing",
          data: null,
        };
      }

      // Validate if the user exists and is active
      const checkUserExists = await userModel.findOne({
        _id: body.userId,
        isActive: true,
      });
      if (!checkUserExists) {
        return {
          status: 404,
          error: true,
          message: "User Doesn't Exists",
          data: null,
        };
      }

      // Validate if the book exists and is active
      const checkBookExists = await bookModel.findOne({
        _id: body.bookId,
        isActive: true,
      });
      if (!checkBookExists) {
        return {
          status: 404,
          error: true,
          message: "Book Doesn't Exists",
          data: null,
        };
      }

      // Create a new review entry in the database
      const crtReview = await reviewModel.create({
        userId: body.userId,
        bookId: body.bookId,
        reviews: body.reviews,
      });

      // Return a success or failure message based on the result
      if (crtReview) {
        return {
          status: 200,
          error: false,
          message: "Review Created",
          data: crtReview,
        };
      } else {
        return {
          status: 400,
          error: true,
          message: "Failed to Create the Review",
          data: null,
        };
      }
    } catch (error) {
      // Handle any error during the review creation process
      console.log("Create Review Service Failed");
      return {
        status: 400,
        error: true,
        message: "Create Review Service Failed",
        data: null,
      };
    }
  },

  // Service to fetch all reviews
  async getAllReviewSrvc() {
    try {
      // Get all reviews that are not deleted from the database and populate user and book information
      const getAllReview = await reviewModel
        .find({ isDeleted: false })
        .populate("userId")
        .populate("bookId");

      // Return reviews if found, else return a message indicating no reviews found
      if (getAllReview.length > 0) {
        return {
          status: 200,
          error: false,
          message: "All Reviews Lists",
          data: getAllReview,
        };
      } else {
        return {
          status: 404,
          error: true,
          message: "No Reviews Found",
          data: null,
        };
      }
    } catch (error) {
      // Handle any error while fetching all reviews
      console.log("Get All Review Service Failed");
      return {
        status: 400,
        error: true,
        message: "Get All Review Service Failed",
        data: null,
      };
    }
  },

  // Service to fetch reviews for a specific book based on its ID
  async getReviewByBookIdSrvc(id) {
    try {
      // Check if the book exists and is not deleted
      const checkBookExists = await bookModel.findOne({
        _id: id,
        isDeleted: false,
      });
      if (!checkBookExists) {
        return {
          status: 404,
          error: true,
          message: "No Book Found Under This Id",
          data: null,
        };
      }

      // Get all reviews associated with the given book ID
      const getReviews = await reviewModel
        .find({
          bookId: id,
          isDeleted: false,
        })
        .populate("userId")
        .populate("bookId");

      // Return reviews if found, else return a message indicating no reviews found
      if (getReviews.length > 0) {
        return {
          status: 200,
          error: false,
          message: "Retrieved the list of all the reviews under this book",
          data: getReviews,
        };
      } else {
        return {
          status: 404,
          error: true,
          message: "No Reviews Found under this ID",
          data: null,
        };
      }
    } catch (error) {
      // Handle any error while fetching reviews for a specific book
      console.log("Get Review By Book Id Service Failed");
      return {
        status: 400,
        error: true,
        message: "Get Review By Book Id Service Failed",
        data: null,
      };
    }
  },

  // Service to remove a review by marking it as deleted
  async removeReviewSrvc(id) {
    try {
      // Find the review by its ID and mark it as deleted
      const rmvReview = await reviewModel.findOneAndUpdate(
        {
          _id: id,
          isDeleted: false,
        },
        {
          status: false,
          isActive: false,
          isDeleted: true,
        },
        { new: true }
      );

      // Return a success or failure message based on the result
      if (rmvReview) {
        return {
          status: 200,
          error: false,
          message: "Removed the Review",
          data: rmvReview,
        };
      } else {
        return {
          status: 400,
          error: true,
          message: "Failed to Remove the Review",
          data: null,
        };
      }
    } catch (error) {
      // Handle any error while removing a review
      console.log("Remove Review By Id Service Failed");
      return {
        status: 400,
        error: true,
        message: "Remove Review By Id Service Failed",
        data: null,
      };
    }
  },

  // Service for updating a review (currently not implemented)
  async updateReviewSrvc(id, body) {
    try {
      // Update review logic will go here in the future
    } catch (error) {
      // Handle any error while updating the review
      console.log("Update Review Service Failed");
      return {
        status: 400,
        error: true,
        message: "Update Review Service Failed",
        data: null,
      };
    }
  },
};
