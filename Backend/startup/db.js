const mongoose = require('mongoose');
const config = require('config');


/*To change enviroment type in console $env:NODE_ENV="test" or $env:NODE_ENV="dev"*/


module.exports = function() {
  
  mongoose
    .connect(config.get("db"))
    .then(() => {
      console.log(`Connected to ${config.get("db")}...`);
    })
    .catch(() => {
      console.log("Could not connect to MongoDB...");
    });


};
