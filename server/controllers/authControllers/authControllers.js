const authServices = require("../../services/authServices/authServices.js");
const statusCode = require("../../utils/statusCode/statusCode.js");

// Helper function to generate a consistent error response object
const createErrorMessage = (message, data) => {
  return {
    status: statusCode,
    data: data,
    message: message,
    error: true,
  };
};

module.exports = {
  // Handles user registration
  async registerUserController(req, res) {
    try {
      // Call registration logic from service layer
      let response = await authServices.registerUserService(req);
      return res.status(response.status).send(response);
    } catch (error) {
      console.error(error); // Log server-side error for debugging

      // Construct custom error response
      const newError = createErrorMessage();
      newError.data = error;
      newError.message = "Register User Controller Error";
      newError.status = statusCode.internalServerError;
      newError.error = true;

      return res.status(newError.status).json(newError);
    }
  },

  // Handles user login
  async loginUserController(req, res) {
    try {
      // Authenticate user and receive token + status
      let response = await authServices.loginUserService(req.body);

      // Set token as HTTP-only cookie on successful login
      if (!response.error) {
        res.cookie("access_token", response.token, {
          httpOnly: true,
        });
      }

      return res.status(response.status).json(response);
    } catch (error) {
      console.error(error); // Log any unexpected error

      // Build structured error response
      const newError = createErrorMessage();
      newError.data = error;
      newError.message = "Login User Controller Error";
      newError.status = statusCode.internalServerError;
      newError.error = true;

      return res.status(newError.status).json(newError);
    }
  },
};
