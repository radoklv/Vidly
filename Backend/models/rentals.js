const Joi = require('joi');
const mongoose = require('mongoose');
const moment = require('moment');

const rentalSchema = new mongoose.Schema({
    user: {
        type: new mongoose.Schema({
            firstName: {
                type: String,
                require: true,
                minlength: 5,
                maxlenght: 50
            },
            lastName:{
                type: String,
                require: true,
                minlength: 5,
                maxlenght: 50
            },
            phone: {
                type: String,
                require: true,
                minlength: 5,
                maxlength: 50
            },
            email:{
                type: String,
                required: true,
                unique: true,
                minlength: 5,
                maxlength: 255,
            }
        }),
        required: true,
    },

    movie: {
        type: new mongoose.Schema({
            title: {
                type: String,
                required: true,
                trim: true,
                minlength: 5,
                maxlength: 255,
            },
            dailyRentalRate:{
                type: Number,
                required: true,
                min: 0,
                max: 255
            }
        }),
        required: true,
    },

    dateOut: {
        type: Date,
        required: true,
        default: Date.now
    },

    dateReturned: {
        type: Date
    },

    rentalFee: {
        rype: Number,
        min: 0
    }
});


// rentalSchema.statics.lookup = function(customerId, movieId){
//     return this.findOne({
//         'user._id': userId,
//         'movie._id': movieId
//     })
// } 

rentalSchema.methods.return = function() { //Сетва dateReturned и пресмята rentalFee
    this.dateReturned = new Date();

    this.rentalFee = moment().diff(this.dateOut, 'days') * this.movie.dailyRentalRate;
}

const Rental = mongoose.model('Rental', rentalSchema);




function validateRental(rental){
    const schema = Joi.object({
        userId: Joi.objectId().required(),
        movieId: Joi.objectId().required()
    })

    return schema.validate(rental)
};

exports.Rental = Rental;
exports.validateRental = validateRental;