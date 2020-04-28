require('dotenv').config();

const express = require('express');
const userRoutes = express.Router();
const bcrypt  = require('bcrypt');
const jwt = require('jsonwebtoken');
const five = require("johnny-five");

const User = require('../models/user-model');

const newToken = User =>{
 return jwt.sign({id : User.id}  , process.env.SESSION_SECRET , {
    expiresIn:  86400
  });
};


userRoutes.post('/signup' , async (req, res) =>{
    try{
        const { username, password, email, image} = req.body;
        //Validate actions
        if(!username || !password || !email){
            return res.status(400).json({msg: "Not all fields have been entered"});
        }
        if(password.length < 7){
            res.status(400).json({msg : 'Make your password at least 8 characters long for security purposes.'});
            return
        }
        const existingUser = await  User.findOne({username: username});
        if(existingUser) {
            return res
                .status(400)
                .json({msg: "Username taken. Choose another one."})
        }
        const salt     = await bcrypt.genSaltSync(10);
        const hashPass = await bcrypt.hashSync(password, salt);
        const newUser = new User({
            username :username,
            password:hashPass,
            email:email,
            image:image
        });
        const savedUser = await newUser.save();
        res.json(savedUser);


    }catch (e) {
        res.status(500).json({e});
    }

  
  
});
userRoutes.post('/signin' , (req,res)=>{
  const {email,password} = req.body;

  console.log(email,password);
  if(!email || !password){
    return res.status(400).json({message : 'need username and password'})
  }

  User.findOne({email : email}, (err, user) =>{
    console.log(user.username);
    if(err){
      console.error(err);
      res.status(500).json({ 'error' : 'Internal error please try again'});

    }else if(!user){
      return res.status(401).json({'message' : 'Incorrect email or password'})
    }else{
      user.checkPassword(password, (err, same) =>{

        if(err){
          res.status(500).json({'message' : 'Internal error please try again'})
        }else if(!same){

          res.status(401).json({'message' : 'Incorrect email or password'})
        }else{
          const payload = {email};
          const token = jwt.sign(payload, process.env.SESSION_SECRET ,{
          expiresIn:'1h'
      });

              const board = new five.Board()

              board.on('ready', function() {
               let  lcd = new five.LCD({
                  pins: [7, 8, 9, 10, 11, 12],
                  backlight: 6,
                  rows: 2,
                  cols: 16
                });
                lcd.clear().print("Hello");
                lcd.cursor(1, 0);
                lcd.clear().print(user.username);

                this.repl.inject({
                  lcd: lcd
                });

              });
              res.cookie('token', {user, token}, { httpOnly: true }).status(200).send({user, token})

        }

      } )
    }
  });

});



module.exports = userRoutes;