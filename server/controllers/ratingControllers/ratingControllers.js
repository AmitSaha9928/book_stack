const statusCode = require("../../utils/statusCode/statusCode.js");
const ratingServices = require("../../services/ratingServices/ratingServices.js");

// Helper function to construct standardized error responses
const createErrorMessage = (message, data) => {
  return {
    status: statusCode,
    data: data,
    message: message,
    error: true,
  };
};

module.exports = {
  // Handles creation of a new rating entry
  async crtRatingController(req, res) {
    try {
      let response = await ratingServices.createRatingService(req.body);
      return res.status(response.status).send(response);
    } catch (error) {
      console.error(error, "Create Rating Controller Error");

      const newError = createErrorMessage();
      newError.data = error;
      newError.message = "Create Rating Controller Error";
      newError.status = statusCode.internalServerError;
      newError.error = true;

      return res.status(newError.status).json(newError);
    }
  },

  // Fetches average rating for a specific book by book ID
  async getBookAverageRatingController(req, res) {
    try {
      let response = await ratingServices.getBookAverageRatingService(
        req.params.id
      );
      return res.status(response.status).send(response);
    } catch (error) {
      console.error(error, "Get Book Average Rating Controller Error");

      const newError = createErrorMessage();
      newError.data = error;
      newError.message = "Get Book Average Rating Controller Error";
      newError.status = statusCode.internalServerError;
      newError.error = true;

      return res.status(newError.status).json(newError);
    }
  },

  // Returns all rating entries
  async getAllRatingController(req, res) {
    try {
      let response = await ratingServices.getAllRatingService();
      return res.status(response.status).send(response);
    } catch (error) {
      console.error(error, "Get All Rating Controller Error");

      const newError = createErrorMessage();
      newError.data = error;
      newError.message = "Get All Rating Controller Error";
      newError.status = statusCode.internalServerError;
      newError.error = true;

      return res.status(newError.status).json(newError);
    }
  },

  // Gets all ratings submitted by a specific user
  async getRatingByUserIdController(req, res) {
    try {
      let response = await ratingServices.getByUsersIdRatingService(
        req.params.id
      );
      return res.status(response.status).send(response);
    } catch (error) {
      console.error(error, "Get Rating By User ID Controller Error");

      const newError = createErrorMessage();
      newError.data = error;
      newError.message = "Get Rating By User ID Controller Error";
      newError.status = statusCode.internalServerError;
      newError.error = true;

      return res.status(newError.status).json(newError);
    }
  },

  // Gets all ratings given to a specific book
  async getRatingByBookIdController(req, res) {
    try {
      let response = await ratingServices.getByBookIdRatingService(
        req.params.id
      );
      return res.status(response.status).send(response);
    } catch (error) {
      console.error(error, "Get Rating By Book ID Controller Error");

      const newError = createErrorMessage();
      newError.data = error;
      newError.message = "Get Rating By Book ID Controller Error";
      newError.status = statusCode.internalServerError;
      newError.error = true;

      return res.status(newError.status).json(newError);
    }
  },

  // Deletes a rating by its ID
  async removeRatingController(req, res) {
    try {
      let response = await ratingServices.delRatingService(req.params.id);
      return res.status(response.status).send(response);
    } catch (error) {
      console.error(error, "Remove Rating Controller Error");

      const newError = createErrorMessage();
      newError.data = error;
      newError.message = "Remove Rating Controller Error";
      newError.status = statusCode.internalServerError;
      newError.error = true;

      return res.status(newError.status).json(newError);
    }
  },
};
