const Joi = require('joi');
const mongoose = require('mongoose');

const User = mongoose.model('User', new mongoose.Schema({
    name:{
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    email:{
        type: String,
        required: true,
        unique: true,
        minlength: 5,
        maxlength: 255
    },
    password:{
        type: String,
        required: true,
        minlength: 6,
        maxlength: 1024,
    }
}));

function validateUser(user){
    const schema = Joi.object({
        name: Joi.string().min(5).max(60).required(),
        email: Joi.string().email().min(5).max(255).required(),
        password: Joi.string().min(6).max(255).required()
    });

    return schema.validate(user)
};

exports.User = User;
exports.validateUser = validateUser;
