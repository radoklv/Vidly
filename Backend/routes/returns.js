const {Rental} = require('../models/rentals');
const {Movie} = require('../models/movies');
const express = require("express");
const router = express.Router();
const asyncMiddleware = require('../middlewere/async');
const Joi = require('joi')


/* IMPORTANT!!! ALL ROUTES BEGIN WITH /api/returns/ */

/*---------------------------------------- GET ----------------------------------------*/
router.get("/", asyncMiddleware(async (req, res) => {

    const validateRes = validateResult(req.body);

    if (validateRes.error) {
      return res.status(400).send(validateRes.error.details[0].message);
    }

    const rental = await Rental.findOne({_id: req.body.rentalId}); //Статичен метод на класа Rental

    if(!rental){
        return res.status(404).send('Tere is no rental with this ID!')
    }

    if(rental.dateReturned){
        return res.status(400).send('The movie is already returned');    
    }

    rental.return();

    await rental.save();

    await Movie.updateOne({_id: rental.movie._id},{
        $inc: {numberInStock: 1}
    });

    res.send(rental);

  })
);


function validateResult(genre) {
    const schema = Joi.object({
      rentalId: Joi.objectId().required(),
    });
  
    return schema.validate(genre);
  }

module.exports = router;