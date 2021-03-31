const { Rental, validateRental } = require("../models/rentals");
const Fawn = require('fawn')
const { Movie } = require("../models/movies");
const { Customer } = require("../models/customers");
const mongoose = require('mongoose');
const express = require("express");
const router = express.Router();

/* IMPORTANT!!! ALL ROUTES BEGIN WITH /api/rentals/ */


Fawn.init(mongoose) // This is Transaction. For more info 9 Module-> 8 Lecture

/*---------------------------------------- GET ----------------------------------------*/

router.get('/', async(req, res)=>{
  const rentals = await Rental.find().sort();
})

/*---------------------------------------- POST ----------------------------------------*/

router.post("/", async (req, res) => {
  const { error } = validateRental(req.body);

  if (error) {
    res.status(400).send(error.details[0].message);
  }

  const customer = await Customer.findById(req.body.customerId);
  if (!customer) {
    return res.status(400).send(`Invalid Customer Id!`);
  }

  const movie = await Movie.findById(req.body.movieId);
  if (!movie) {
    return res.status(400).send("Invaid movie Id!");
  }

  if (movie.numberInStock === 0) {
    return res.status(400).send("Movie is out of stock!");
  }

  let rental = new Rental({
    customer: {
      _id: customer._id,
      isGold: customer.isGold,
      phone: customer.phone,
    },
    movie: {
      _id: movie._id,
      title: movie.title,
      dailyRentalRate: movie.dailyRentalRate,
    },
  });

  try {
    // rental = await rental.save();
    // movie.numberInStock--;
    // movie.save();
    // res.send(rental);

    //OR
    
    new Fawn.Task() // This is Transaction. For more info 9 Module-> 8 Lecture
      .save('rentals', rental)
      .update('movies',{_id: movie._id}, {
        $inc: {numberInStock: -1}
      })
      .run()
      res.send(rental);
  }catch(ex){
    res.status(400).send(ex.message)
  }
});

module.exports = router;
