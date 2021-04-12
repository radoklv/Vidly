const Joi = require("joi");
const mongoose = require("mongoose");
const config = require("config");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50,
  },
  lastName:{
    type: String,
    required: true,
    minlength: 3,
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
  phone: {
    type: String,
    required: true,
    min: 9,
    max: 12,
    pattern: /^[0-9]{10}$/,
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
    firstName: Joi.string().min(3).max(50).required(),
    lastName: Joi.string().min(3).max(50).required(),
    email: Joi.string().email().min(5).max(255).required(),
    password: Joi.string().min(6).max(255).required(),
    phone: Joi.string().min(9).max(12).required(),
  });

  return schema.validate(user);
}

exports.User = User;
exports.validateUser = validateUser;
