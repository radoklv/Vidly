const Joi = require("joi");
const mongoose = require("mongoose");
const config = require("config");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    minlength: 5,
    maxlength: 255,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 1024,
  },
  isAdmin:{
    type: Boolean,
    default: false,
  }
});

userSchema.methods.generateAuthToken = function () {
  //По този начин добавяме наш метод 'generateAuthToken', към UserSchema. Той ще е отговорен за създаването на Токена
  return jwt.sign(
    { _id: this.id, isAdmin: this.isAdmin }, //Тук специфицираме какво да има в Токена който ще генерираме.
    config.get("jwtPrivateKey") // Праща се и системната променлива от сървъра
  );

};

const User = mongoose.model("User", userSchema);

function validateUser(user) {
  const schema = Joi.object({
    name: Joi.string().min(5).max(60).required(),
    email: Joi.string().email().min(5).max(255).required(),
    password: Joi.string().min(6).max(255).required(),
  });

  return schema.validate(user);
}

exports.User = User;
exports.validateUser = validateUser;
