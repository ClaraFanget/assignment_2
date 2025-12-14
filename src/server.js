const mongoose = require("mongoose");
require("dotenv").config();

const app = require("./app");

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to database!");
    app.listen(3000, "0.0.0.0", () =>
      console.log("Server started at http://localhost:3000")
    );
  })
  .catch((error) => {
    console.log(error);
    console.log("Connection failed!");
  });
