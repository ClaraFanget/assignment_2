const mongoose = require("mongoose");
require("dotenv").config();

const app = require("./app");

const PORT = process.env.PORT || 3000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to database!");

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server started and listening on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error(error);
    console.log("Connection failed!");
  });
