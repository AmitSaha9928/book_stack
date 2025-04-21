const categoryServices = require("../../services/categoryServices/categoryServices.js");
const statusCode = require("../../utils/statusCode/statusCode.js");

// Utility to consistently format error responses
const createErrorMessage = (message, data) => {
  return {
    status: statusCode,
    data: data,
    message: message,
    error: true,
  };
};

module.exports = {
  // Handles creation of a new category
  async createCategoryController(req, res) {
    try {
      let response = await categoryServices.createCategoryService(req);
      return res.status(response.status).send(response);
    } catch (error) {
      console.error(error);

      const newError = createErrorMessage();
      newError.data = error;
      newError.message = "Create Category Controller Error";
      newError.status = statusCode.internalServerError;

      return res.status(newError.status).json(newError);
    }
  },

  // Fetches all categories
  async getAllCategoryController(req, res) {
    try {
      let response = await categoryServices.getAllCategoryService();
      return res.status(response.status).send(response);
    } catch (error) {
      console.error(error);

      const newError = createErrorMessage();
      newError.data = error;
      newError.message = "Get All Category Controller Error";
      newError.status = statusCode.internalServerError;

      return res.status(newError.status).json(newError);
    }
  },

  // Retrieves a single category by its ID
  async getSingleCategoryController(req, res) {
    try {
      let response = await categoryServices.getCategoryByIdService(
        req.params.id
      );
      return res.status(response.status).send(response);
    } catch (error) {
      console.error(error);

      const newError = createErrorMessage();
      newError.data = error;
      newError.message = "Get Single Category Controller Error";
      newError.status = statusCode.internalServerError;

      return res.status(newError.status).json(newError);
    }
  },

  // Removes a specific category by ID
  async removeSingleCategoryController(req, res) {
    try {
      let response = await categoryServices.removeCategoryService(
        req.params.id
      );
      return res.status(response.status).send(response);
    } catch (error) {
      console.error(error);

      const newError = createErrorMessage();
      newError.data = error;
      newError.message = "Remove Single Category Controller Error";
      newError.status = statusCode.internalServerError;

      return res.status(newError.status).json(newError);
    }
  },

  // Updates a specific category by ID
  async updateSingleCategoryController(req, res) {
    try {
      let response = await categoryServices.updateCategoryService(
        req.params.id
      );
      return res.status(response.status).send(response);
    } catch (error) {
      console.error(error);

      const newError = createErrorMessage();
      newError.data = error;
      newError.message = "Single Category Controller Error";
      newError.status = statusCode.internalServerError;

      return res.status(newError.status).json(newError);
    }
  },
};
