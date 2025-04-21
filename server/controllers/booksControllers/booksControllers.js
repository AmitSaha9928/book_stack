const statusCode = require("../../utils/statusCode/statusCode");
const bookServices = require("../../services/bookServices/bookServices.js");

// Reusable error response factory for controller error handling
const createErrorMessage = (message, data) => {
  return {
    status: statusCode,
    data: data,
    message: message,
    error: true,
  };
};

module.exports = {
  // Insert a new book into the database
  async insertBookController(req, res) {
    try {
      let response = await bookServices.insertBookService(req);
      return res.status(response.status).send(response);
    } catch (error) {
      console.error(error);

      const newError = createErrorMessage();
      newError.data = error;
      newError.message = "Inser Book Controller Error"; // Typo in "Inser" could be cleaned later
      newError.status = statusCode.internalServerError;
      newError.error = true;

      return res.status(newError.status).json(newError);
    }
  },

  // Fetch all books from the system
  async getAllBookController(req, res) {
    try {
      let response = await bookServices.getAllBookService();
      return res.status(response.status).send(response);
    } catch (error) {
      console.error(error);

      const newError = createErrorMessage();
      newError.data = error;
      newError.message = "Get All Books Controller Error";
      newError.status = statusCode.internalServerError;
      newError.error = true;

      return res.status(newError.status).json(newError);
    }
  },

  // Fetch a list of most recently added books
  async getRecentBoosController(req, res) {
    try {
      let response = await bookServices.getRecentBooksService();
      return res.status(response.status).send(response);
    } catch (error) {
      console.error(error);

      const newError = createErrorMessage();
      newError.data = error;
      newError.message = "Get Recent Books Controller Error";
      newError.status = statusCode.internalServerError;
      newError.error = true;

      return res.status(newError.status).json(newError);
    }
  },

  // Retrieve a single book by its ID
  async getSingleBookByIdController(req, res) {
    try {
      let response = await bookServices.getSingleBookService(req.params.id);
      return res.status(response.status).send(response);
    } catch (error) {
      console.error(error);

      const newError = createErrorMessage();
      newError.data = error;
      newError.message = "Get SIngle Book By Id Controller Error";
      newError.status = statusCode.internalServerError;
      newError.error = true;

      return res.status(newError.status).json(newError);
    }
  },

  // Get books uploaded by a specific user
  async getBookByUserIdController(req, res) {
    try {
      let response = await bookServices.getBookByUserIdService(req.params.id);
      return res.status(response.status).send(response);
    } catch (error) {
      console.error(error);

      const newError = createErrorMessage();
      newError.data = error;
      newError.message = "Get Book By User Id Controller Error";
      newError.status = statusCode.internalServerError;
      newError.error = true;

      return res.status(newError.status).json(newError);
    }
  },

  // Remove a single book by its ID
  async rmvBookByIdController(req, res) {
    try {
      let response = await bookServices.removeBooksService(req.params.id);
      return res.status(response.status).send(response);
    } catch (error) {
      console.error(error);

      const newError = createErrorMessage();
      newError.data = error;
      newError.message = "Remove SIngle Book By Id Controller Error";
      newError.status = statusCode.internalServerError;
      newError.error = true;

      return res.status(newError.status).json(newError);
    }
  },

  // Update a single book by its ID
  async uptBookByIdController(req, res) {
    try {
      let response = await bookServices.updateBookService(
        req.params.id,
        req.body
      );
      return res.status(response.status).send(response);
    } catch (error) {
      console.error(error);

      const newError = createErrorMessage();
      newError.data = error;
      newError.message = "Update SIngle Book By Id Controller Error";
      newError.status = statusCode.internalServerError;
      newError.error = true;

      return res.status(newError.status).json(newError);
    }
  },
};
