const Joi = require("joi");
const mongoose = require("mongoose");

const Customer = mongoose.model(
  "Customer",
  new mongoose.Schema({
    name: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 50,
    },
    isGold: {
      type: Boolean,
      required: false,
    },
    phone: {
      type: String,
      required: true,
      min: 9,
      max: 12,
      pattern: /^[0-9]{10}$/,
    },
  })
);

function validateCustomer(customer) {
  const schema = Joi.object({
    name: Joi.string().min(5).max(50).required(),
    isGold: Joi.boolean(),
    phone: Joi.string().min(9).max(12).required(),
  });

  return schema.validate(customer);
}

exports.Customer = Customer;
exports.validateCustomer = validateCustomer;