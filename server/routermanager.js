const { app } = require("./app.js");
const authRoutes = require("./routes/authRoutes/authRoutes.js");
const userRoutes = require("./routes/userRoutes/userRoutes.js");
const bookRoutes = require("./routes/bookRoutes/bookRoutes.js");
const categoryRoutes = require("./routes/categoryRoutes/categoryRoutes.js");
const reviewRoutes = require("./routes/reviewRoutes/reviewRoutes.js");
const ratingRoutes = require("./routes/ratingRoutes/ratingRoutes.js");

const routermanager = () => {
  //Auth Routes//
  app.use("/auth", authRoutes);

  //User Routes//
  app.use("/users", userRoutes);

  //Books Routes//
  app.use("/books", bookRoutes);

  //Category Routes//
  app.use("/categories", categoryRoutes);

  //Review Routes//
  app.use("/reviews", reviewRoutes);

   //Rating Routes//
   app.use("/ratings", ratingRoutes);
};

module.exports = routermanager;
