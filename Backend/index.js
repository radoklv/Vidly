
const config = require("config"); //
const Joi = require("joi"); //Слагаме тук Joi за да може да се ползва глобално в приложението
Joi.objectId = require("joi-objectid")(Joi);
const express = require("express");
const app = express();

require('./startup/routes')(app) //(app) се подава като параметър, за да не се инстанцира отново в новия модул

app.use('/public', express.static('public')); //За да бъде папката публично достъпна

// app.use(express.static('public'))
if (!config.get("jwtPrivateKey")) {
  //Това е системна променлива сетната на 'сървъра'. Тя е с цел, защита. Ако я няма, приложението няма да стартира.
  throw new Error("FATAL ERROR: jwtPrivateKey is not defined");

}

require('./startup/db')(app);


const port = process.env.PORT || 3000;

module.exports = app.listen(port, () => console.log(`Listening on port ${port}...`));

