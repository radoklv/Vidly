const { string } = require("Joi");
const Joi = require("Joi");
const { min } = require("moment");
Joi.objectId = require("joi-objectid")(Joi);
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

    director:{
        type: String,
        required: true,
        min: 5,
        max: 50,
    },

    cast: [{
        name: {
            type:String,
            required: true,
        }
    }],

    year: {
        type: Number,
        min: 1900,
        max: new Date().getFullYear()
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
    },

    movieImage:{
        type: String,
        required: true,
    }
}))

function validateMovie(movie) {
    const schema = Joi.object({
      title: Joi.string().trim().min(2).max(50).required(),
      genreId: Joi.objectId().required(),
      director: Joi.string().trim().min(5).max(50).required(),
      cast: Joi.array().items(Joi.object().keys({
          name: Joi.string().trim().min(3).max(50).required()
      })).min(1).required(),
      year: Joi.number().min(1900).max(new Date().getFullYear()),
      numberInStock: Joi.number().min(0).max(255).required(),
      dailyRentalRate: Joi.number().min(0).max(255).required(),
    });
  
    return schema.validate(movie);
}


exports.Movie = Movie;
exports.validateMovie = validateMovie;
