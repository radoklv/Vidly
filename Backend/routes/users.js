const _ = require('lodash');
const bcrypt = require('bcrypt');
const passwordComplexity = require('joi-password-complexity');
const { User, validateUser } = require('../models/users');
const express = require('express');
const router = express.Router();

const complexityOptions = {
    min: 6,
    max: 255,
    // lowerCase: 1,
    // upperCase: 1,
    // numeric: 1,
    // symbol: 1,
    // requirementCount: 2,
  };

/* IMPORTANT!!! ALL ROUTES BEGIN WITH /api/users/ */


/*---------------------------------------- POST ----------------------------------------*/

router.post("/", async(req, res)=>{
    const {error} = validateUser(req.body);

    if(error){
        res.status(400).send(error.details[0].message);
    }

    let user = await User.findOne({email: req.body.email});

    if(user){
        res.status(400).send("User already register");
    }

    const isPassCompex = passwordComplexity(complexityOptions, 'Password').validate(req.body.password);

    if(isPassCompex.error){
        let isPassCompexMessages = "";

        for(let i in isPassCompex.error.details){
            isPassCompexMessages += isPassCompex.error.details[i].message + '\n';  
        }
        
        return res.send(isPassCompexMessages);
    }
 
    user = new User(_.pick(req.body, ['name', 'email', 'password'])); //Може да създадем по този начин User-a. Чрез метода Lodash.pick, в случая, избираме само тези пропъртита от обекта user

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt); // Хеширане на паролата


    try{
        await user.save();
        res.send( _.pick(user, ['_id', 'name', 'email'])); // По този начин чрез Lodash.pick, връщаме само елементите които искаме. Това се прави с цел, в случая, да не върнем паролата с респонса.
    }catch(ex){
        res.status(400).send(ex.message);
    }
});



module.exports = router;