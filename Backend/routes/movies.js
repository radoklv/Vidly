const { Movie, validateMovie } = require("../models/movies");
const { Genre } = require("../models/genres");
const validateObjectId = require("../middlewere/validateObjoctId");
const express = require("express");
const router = express.Router();
const isAuth = require("../middlewere/auth");
const isAdmin = require("../middlewere/admin");
const upload = require("../middlewere/upload");
const fs = require("fs");
const _ = require('lodash');

/* IMPORTANT!!! ALL ROUTES BEGIN WITH /api/movies/ */

/*---------------------------------------- GET ----------------------------------------*/
router.get("/", async (req, res) => {
  const movies = await Movie.find().sort("title");
  res.send(movies);
});

router.get("/:id", validateObjectId, async (req, res) => {
  try {
    const result = await Movie.find({ _id: req.params.id });
    res.send(result);
  } catch (ex) {
    return res
      .status(400)
      .send(`Movie with this ID ${req.params.id} was not found`);
  }
});

/*---------------------------------------- POST ----------------------------------------*/

router.post("/", [isAuth, isAdmin, upload], async (req, res) => {
  req.body.cast = JSON.parse(req.body.cast);

  const { error } = validateMovie(req.body);

  if (req.file == undefined) {
    res
      .status(400)
      .send(
        "Image is required. Only '.jpg' and '.png' format is accepted, with max size of 2mb"
      );
  }

  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const genre = await Genre.findById(req.body.genreId);

  if (!genre) {
    return res.status(400).send("Invalid genre");
  }

  const movie = new Movie({
    title: req.body.title,
    genre: {
      _id: genre._id,
      name: genre.name,
    },
    director: req.body.director,
    cast: req.body.cast,
    year: req.body.year,
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate,
    movieImage: req.file.path,
  });

  try {
    await movie.save();
    res.send(movie);
  } catch (ex) {
    res.status(400).send(ex.message);
  }
});

/*---------------------------------------- PUT ----------------------------------------*/

router.put("/:id", [isAuth, isAdmin, validateObjectId], async (req, res) => {
  const { error } = validateMovie(req.body);

  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  let genre = undefined;

  try {
    genre = await Genre.findById(req.body.genreId);
  } catch (ex) {
    return res.status(400).send("Invalid genre!");
  }

  try {
    const movie = await Movie.findByIdAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          title: req.body.title,
          genre: {
            _id: genre._id,
            name: genre.name,
          },
          numberInStock: req.body.numberInStock,
          dailyRentalRate: req.body.dailyRentalRate,
        },
      },
      {
        new: true,
      }
    );

    res.send(movie);
  } catch (ex) {
    return res.status(404).send(`Movie with ${req.params.id} was not found`);
  }
});

/*---------------------------------------- DELETE ----------------------------------------*/

router.delete("/:id", [validateObjectId, isAuth, isAdmin], async (req, res) => {
  try {
    const movie = await Movie.findByIdAndRemove(req.params.id);

    fs.unlink(movie.movieImage, (err) => {
      if (err) {
        console.error(err);
        return;
      }
    });
    res.send(_.pick(movie, ['_id', 'title']));
  } catch (ex) {
    return res
      .status(404)
      .send(`Movie with the given ID ${req.params.id} was not found.`);
  }
});

module.exports = router;
