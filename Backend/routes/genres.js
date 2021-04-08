const asyncMiddleware = require('../middlewere/async');
const validateObjectId = require('../middlewere/validateObjoctId');
const express = require("express");
const router = express.Router();
const { Genre, validateGenre } = require("../models/genres");
const isAuth = require("../middlewere/auth");
const isAdmin = require("../middlewere/admin");

/* IMPORTANT!!! ALL ROUTES BEGIN WITH /api/genres/ */


/*---------------------------------------- GET ----------------------------------------*/
router.get("/", asyncMiddleware(async (req, res) => {
    const genres = await Genre .find().sort("name");
    res.send(genres);
  })
);

router.get("/:id",validateObjectId, asyncMiddleware( async (req, res) => {

    const result = await Genre.find({ _id: req.params.id });
    res.send(result);

}));

/*---------------------------------------- POST ----------------------------------------*/

router.post("/", [isAuth, isAdmin], asyncMiddleware((req, res) => {
  //Тук 'isAuth' e middleware ф-я, служеща за валидиране на токена

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
}));

/*---------------------------------------- PUT ----------------------------------------*/

router.put("/:id", [validateObjectId, isAuth, isAdmin],asyncMiddleware( async (req, res) => {
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
}));

/*---------------------------------------- DELETE ----------------------------------------*/
router.delete("/:id", [validateObjectId, isAuth, isAdmin], asyncMiddleware(async (req, res) => {
  try {
    const result = await Genre.findByIdAndRemove(req.params.id);
    res.send(result);
  } catch (ex) {
    return res
      .status(404)
      .send(`Genre with the given ID ${req.params.id} was not found.`);
  }
}));

module.exports = router;
