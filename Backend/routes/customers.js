const {Customer, validateCustomer} = require('../models/customers'); 
const express = require("express");
const router = express.Router();

/* IMPORTANT!!! ALL ROUTES BEGIN WITH /api/customers/ */

/*---------------------------------------- GET ----------------------------------------*/

router.get("/", async (req, res) => {
  const result = await Customer.find().sort("name");

  res.send(result);
});

router.get("/:id", async (req, res) => {
  try {
    const result = await Customer.find({ _id: req.params.id });
    res.send(result);
  } catch (ex) {
    return res
      .status(404)
      .send(`Customer with ID ${req.params.id} was not found`);
  }
});

/*---------------------------------------- POST ----------------------------------------*/

router.post("/", async (req, res) => {
  const validateRes = validateCustomer(req.body);

  if (!validateRes) {
    return res.status(400).send(validateRes.error.details[0].message);
  }

  const customer = new Customer({
    name: req.body.name,
    isGold: req.body.isGold,
    phone: req.body.phone,
  });

  try {
    await customer.save();
    res.send(customer);
  } catch (ex) {
    res.status(400).send(ex.message);
  }
});

/*---------------------------------------- PUT ----------------------------------------*/

router.put("/:id", async (req, res) => {
  const validateRes = validateCustomer(req.body);

  if (validateRes.error) {
    return res.status(400).send(validateRes.error.details[0].message);
  }

  try {
    const result = await Customer.findByIdAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          name: req.body.name,
          isGold: req.body.isGold,
          phone: req.body.phone,
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
      .send(`Customer with ID ${req.params.id} was not found`);
  }
});

/*---------------------------------------- DELETE ----------------------------------------*/

router.delete("/:id", async (req, res) => {
  try {
    const result = await Customer.findByIdAndRemove(req.params.id);
    res.send(result);
  } catch (ex) {
    return res
      .status(404)
      .send(`Customer with the given ID ${req.params.id} was not found.`);
  }
});

module.exports = router;
