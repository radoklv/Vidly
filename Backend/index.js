const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const express = require('express');
const mongoose = require('mongoose');
const app = express();

//mongoose
mongoose.connect('mongodb://localhost/vidly')
    .then(()=>{
        console.log('Connected to MongoDB...')
    }).catch(() =>{
        console.log('Could not connect to MongoDB...')
    })

// Routes
const genres = require('./routes/genres');
const customers = require('./routes/customers');
const movies = require('./routes/movies');
const rentals = require('./routes/rentals');

app.use(express.json());

//Assign Routes
app.use('/api/genres', genres);
app.use('/api/customers', customers);
app.use('/api/movies', movies)
app.use('/api/rentals', rentals)


const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
