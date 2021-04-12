const { Rental, validateRental } = require("../models/rentals");
const Fawn = require('fawn')
const { Movie } = require("../models/movies");
const { User } = require("../models/users");
const mongoose = require('mongoose');
const express = require("express");
const router = express.Router();
const isAuth = require('../middlewere/auth');

/* IMPORTANT!!! ALL ROUTES BEGIN WITH /api/rentals/ */


Fawn.init(mongoose) // Това е Transaction в базата данни.

/*---------------------------------------- GET ----------------------------------------*/

router.get('/', async(req, res)=>{
  const rentals = await Rental.find().sort();
  res.send(rentals);
})

/*---------------------------------------- POST ----------------------------------------*/

router.post("/", isAuth, async (req, res) => {//Тук 'auth' e middleware ф-я, служеща за валидиране на токена
  const { error } = validateRental(req.body);

  if (error) {
    res.status(400).send(error.details[0].message);
  }

  const user = await User.findById(req.body.userId);
  if (!user) {
    return res.status(400).send(`Invalid User Id!`);
  }

  const movie = await Movie.findById(req.body.movieId);
  if (!movie) {
    return res.status(400).send("Invaid movie Id!");
  }

  if (movie.numberInStock === 0) {
    return res.status(400).send("Movie is out of stock!");
  }

  let rental = new Rental({
    user: {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      email: user.email
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
    
    new Fawn.Task() // Това е Transaction в базата данни.
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
