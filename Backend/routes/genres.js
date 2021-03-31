const express = require("express");
const router = express.Router();
const {Genre, validateGenre} = require('../models/genres');

/* IMPORTANT!!! ALL ROUTES BEGIN WITH /api/genres/ */

/*---------------------------------------- GET ----------------------------------------*/
router.get("/", async (req, res) => {
  const genres = await Genre.find().sort("name");
  res.send(genres);
});

router.get("/:id", async (req, res) => {
  try {
    const result = await Genre.find({ _id: req.params.id });
    res.send(result);
  } catch (ex) {
    return res
      .status(404)
      .send(`Genre with the given ID ${req.params.id} was not found.`);
  }

});

/*---------------------------------------- POST ----------------------------------------*/

router.post("/", (req, res) => {
  const validateRes = validateGenre(req.body);

  if (validateRes.error) {
    return res.status(400).send(validateRes.error.details[0].message);
  }

  const genre = new Genre({
    name: req.body.name,
  });

  genre
    .save()
    .then(() => {
      res.send(genre);
    })
    .catch((ex) => {
      res.status(400).send(ex.message);
    });
});

/*---------------------------------------- PUT ----------------------------------------*/

router.put("/:id", async (req, res) => {
  const validateRes = validateGenre(req.body);
  if (validateRes.error) {
    return res.status(400).send(validateRes.error.details[0].message);
  }

  try {
    const result = await Genre.findByIdAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          name: req.body.name,
        },
      },
      {
        new: true,
      }
    );

    res.send(result);
  } catch (ex) {
    return res
      .status(404)
      .send(`Genre with the given ID ${req.params.id} was not found.`);
  }
});

/*---------------------------------------- DELETE ----------------------------------------*/
router.delete("/:id", async (req, res) => {
  try {
    const result = await Genre.findByIdAndRemove(req.params.id);
    res.send(result);
  } catch (ex) {
    return res
      .status(404)
      .send(`T Genre with the given ID ${req.params.id} was not found.`);
  }
});

module.exports = router;
