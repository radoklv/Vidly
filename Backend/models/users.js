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
    },
    password:{
        type: String,
        required: true,
        minlength: 6,
        maxlength: 20,
    }
}));

function validateUser(user){
    const schema = Joi.object({
        name: Joi.string().min(5).max(60).required(),
        email: Joi.string().email().required(),
        password: Joi.string()
    });

    return schema.validate(user)
};

exports.User = User;
exports.validateUser = validateUser;
