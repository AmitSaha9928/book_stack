require('dotenv').config();
const mongoose = require("mongoose");

// Load MongoDB URI from environment variables
const URI = `${process.env.URI}`;

//Establishes connection to MongoDB using Mongoose

const connectToDb = async () => {
  try {
    await mongoose.connect(URI);
    console.log("Database Connected Successfully!");
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(0); // Exit the app if DB connection fails
  }
};

module.exports = connectToDb;
