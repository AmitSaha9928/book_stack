const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const path = require("path");
const userModel = require("../../models/usersModel/usersModel.js");
const missingInputs = require("../../utils/missingInputs/missingInputs.js");

module.exports = {
  // Service to register a new user
  async registerUserService(data) {
    try {
      const { firstName, lastName, phoneNumber, userRole, username, email, password } = data.body;

      // Handle image upload
      let imageName = null;
      if (data.file && data.file.path) {
        imageName = path.basename(data.file.path);
      }

      // Check if all required fields are provided
      const requiredFields = { firstName, lastName, phoneNumber, userRole, username, email, password };
      for (const [fieldName, fieldValue] of Object.entries(requiredFields)) {
        const missing = missingInputs(fieldValue, fieldName);
        if (missing) return missing; // Return error if any field is missing
      }

      // Check if user already exists
      const existingUser = await userModel.findOne({
        $or: [{ email }, { username }],
      });

      if (existingUser) {
        return {
          status: 409,
          error: false,
          message: "User already exists",
          data: existingUser,
        };
      }

      // Hash the password before saving
      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(password, salt);

      // Create a new user
      const newUser = await userModel.create({
        firstName,
        lastName,
        phoneNumber,
        userRole,
        username,
        email,
        password: hashedPassword,
        userImg: imageName,
      });

      // Return success or failure based on user creation
      if (newUser) {
        return {
          status: 201,
          error: false,
          message: "User created successfully",
          data: newUser,
        };
      } else {
        return {
          status: 400,
          error: true,
          message: "Failed to create user",
          data: null,
        };
      }
    } catch (error) {
      console.log("Register User Service Error", error);
      return {
        status: 400,
        error: true,
        data: null,
        message: "Register User Service Error",
      };
    }
  },

  // Service to log in a user
  async loginUserService(body) {
    try {
      const { email, password } = body;

      // Find user by email
      const user = await userModel.findOne({ email, isActive: true });
      if (!user) {
        return {
          status: 404,
          error: true,
          message: "User not found",
          data: null,
        };
      }

      // Compare provided password with stored password
      const isMatch = bcrypt.compareSync(password, user.password);

      if (!isMatch) {
        return {
          status: 400,
          error: true,
          message: "Password does not match",
          data: null,
        };
      }

      // Create a JWT token for the user
      const token = jwt.sign({ id: user._id }, "jwtkey");

      // Return user data without password and the generated token
      const { password: _, ...userData } = user._doc;
      return {
        status: 200,
        error: false,
        message: "Login Successful",
        data: {
          user: userData,
          token,
        },
      };
    } catch (error) {
      console.log("Login User Service Error", error);
      return {
        status: 400,
        error: true,
        data: null,
        message: "Login User Service Error",
      };
    }
  },
};
