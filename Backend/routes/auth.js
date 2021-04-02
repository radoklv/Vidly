const config = require('config');
const jwt = require('jsonwebtoken');
const _ = require("lodash");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const { User } = require("../models/users");
const express = require("express");
const router = express.Router();

/* IMPORTANT!!! ALL ROUTES BEGIN WITH /api/auth/ */

/*---------------------------------------- POST ----------------------------------------*/

router.post("/", async (req, res) => {
  const { error } = validate(req.body);

  if (error) {
    res.status(400).send(error.details[0].message);
  }

  let user = await User.findOne({ email: req.body.email });

  if (!user) {
    return res.status(400).send("Invalid Email or Password!");
  }

  const validPassword = await bcrypt.compare(req.body.password, user.password);

  if (!validPassword) {
   return res.status(400).send("Invalid Email or Password!");
  }

  const token = user.generateAuthToken()//Това е метода който добавихме в User модула, за създаване на токен

  try{
    res.send(token);
  }catch(ex){
    console.log(ex.message)
  }
  
});

function validate(user) {
  const schema = Joi.object({
    email: Joi.string().email().min(5).max(255).required(),
    password: Joi.string().min(6).max(255).required(),
  });

  return schema.validate(user);
}

module.exports = router;
