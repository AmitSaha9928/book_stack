const statusCode = require("../../utils/statusCode/statusCode.js");
const reviewServices = require("../../services/reviewServices/reviewServices.js");

// Helper to structure consistent error responses across controllers
const createErrorMessage = (message, data) => {
  return {
    status: statusCode,
    data: data,
    message: message,
    error: true,
  };
};

module.exports = {
  // Controller to handle review creation
  async crtReviewController(req, res) {
    try {
      let response = await reviewServices.crtReviewSrvc(req.body);
      return res.status(response.status).send(response);
    } catch (error) {
      console.error(error, "Create Review Controller Error");

      const newError = createErrorMessage();
      newError.data = error;
      newError.message = "Create Review Controller Error";
      newError.status = statusCode.internalServerError;
      newError.error = true;

      return res.status(newError.status).json(newError);
    }
  },

  // Controller to fetch all reviews from the system
  async getAllReviewController(req, res) {
    try {
      let response = await reviewServices.getAllReviewSrvc();
      return res.status(response.status).send(response);
    } catch (error) {
      console.error(error, "Get All Review Controller Error");

      const newError = createErrorMessage();
      newError.data = error;
      newError.message = "Get All Review Controller Error";
      newError.status = statusCode.internalServerError;
      newError.error = true;

      return res.status(newError.status).json(newError);
    }
  },

  // Controller to fetch reviews based on a specific book ID
  async getReviewByBookIdController(req, res) {
    try {
      let response = await reviewServices.getReviewByBookIdSrvc(req.params.id);
      return res.status(response.status).send(response);
    } catch (error) {
      console.error(error, "Get Reviews By Book ID Controller Error");

      const newError = createErrorMessage();
      newError.data = error;
      newError.message = "Get Reviews By Book Id Controller Error";
      newError.status = statusCode.internalServerError;
      newError.error = true;

      return res.status(newError.status).json(newError);
    }
  },

  // Controller to handle deletion of a review by ID
  async removeReviewController(req, res) {
    try {
      let response = await reviewServices.removeReviewSrvc(req.params.id);
      return res.status(response.status).send(response);
    } catch (error) {
      console.error(error, "Remove Review Controller Error");

      const newError = createErrorMessage();
      newError.data = error;
      newError.message = "Remove Review Controller Error";
      newError.status = statusCode.internalServerError;
      newError.error = true;

      return res.status(newError.status).json(newError);
    }
  },
};
