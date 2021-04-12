const _ = require('lodash');
const bcrypt = require('bcrypt');
const passwordComplexity = require('joi-password-complexity');
const { User, validateUser } = require('../models/users');
const express = require('express');
const router = express.Router();
const isAuth = require('../middlewere/auth');


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

/*---------------------------------------- GET ----------------------------------------*/

router.get('/me', isAuth, async (req, res)=>{ // Този GET routе, работи само за оторизирани усери
    const user = await User.findById(req.user._id).select('-password') // req.user._id взиа id-то, което е подадено при създаването на токена

    res.send(user);
})

/*---------------------------------------- POST ----------------------------------------*/

router.post("/", async(req, res)=>{
    const {error} = validateUser(req.body);

    if(error){
        res.status(400).send(error.details[0].message);
    }

    let user = await User.findOne({email: req.body.email});

    if(user){
        res.status(400).send("This User is already registered!");
    }

    const isPassComplex = passwordComplexity(complexityOptions, 'Password').validate(req.body.password);

    if(isPassComplex.error){
        let isPassComplexMessages = "";

        for(let i in isPassCompex.error.details){
            isPassComplexMessages += isPassCompex.error.details[i].message + '\n';  
        }
        
        return res.send(isPassComplexMessages);
    }
 
    user = new User(_.pick(req.body, ['firstName','lastName', 'email', 'password'])); //Може да създадем по този начин User-a. Чрез метода Lodash.pick, в случая, избираме само тези пропъртита от обекта user

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt); // Хеширане на паролата

    const token = user.generateAuthToken()//Това е метода който добавихме в User модула, за създаване на токен


    try{
        await user.save();
        res.header('x-auth-token', token).send( _.pick(user, ['_id', 'firstName', 'lastName', 'email', "isAdmin"])); // По този начин чрез Lodash.pick, връщаме само елементите които искаме. Това се прави с цел, в случая, да не върнем паролата с респонса.
    }catch(ex){
        res.status(400).send(ex.message);
    }
});



module.exports = router;