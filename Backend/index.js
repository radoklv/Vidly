const config = require("config"); //
const Joi = require("joi"); //Слагаме тук Joi за да може да се ползва глобално в приложението
Joi.objectId = require("joi-objectid")(Joi);
const express = require("express");
const mongoose = require("mongoose");
const app = express();

// Routes
const genres = require("./routes/genres");
const customers = require("./routes/customers");
const movies = require("./routes/movies");
const rentals = require("./routes/rentals");
const users = require("./routes/users");
const auth = require("./routes/auth");

if (!config.get("jwtPrivateKey")) {  //Това е системна променлива сетната на 'сървъра'. Тя е с цел, защита. Ако я няма, приложението няма да стартира.
  console.log("FATAL ERROR: jwtPrivateKey is not defined");
  process.exit(1);
}

//mongoose
mongoose
  .connect("mongodb://localhost/vidly")
  .then(() => {
    console.log("Connected to MongoDB...");
  })
  .catch(() => {
    console.log("Could not connect to MongoDB...");
  });

app.use(express.json());

//Assign Routes
app.use("/api/genres", genres);
app.use("/api/customers", customers);
app.use("/api/movies", movies);
app.use("/api/rentals", rentals);
app.use("/api/users", users);
app.use("/api/auth", auth);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
