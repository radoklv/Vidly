const Joi = require("Joi");
const mongoose = require("mongoose");
const {genreSchema} = require("../models/genres");


const Movie = mongoose.model('Movie', new mongoose.Schema({
    title:{
        type: String,
        required: true,
        minlength: 2,
        maxlength: 50,
    },

    genre: {
        type: genreSchema,
        required: true
    },
    
    numberInStock: {
        type: Number,
        required: true,
        min: 0,
        max: 255,
    },

    dailyRentalRate: {
        type: Number,
        required: true,
        min: 0,
        max: 255
    }
}))

function validateMovie(movie) {
    const schema = Joi.object({
      title: Joi.string().min(2).max(50).required(),
      genreId: Joi.objectId().required(),
      numberInStock: Joi.number().min(0).max(255).required(),
      dailyRentalRate: Joi.number().min(0).max(255).required()
    });
  
    return schema.validate(movie);
}


exports.Movie = Movie;
exports.validateMovie = validateMovie;
