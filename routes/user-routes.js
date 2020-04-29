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
            return res.status(400).json({msg : 'Make your password at least 8 characters long for security purposes.'});

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
        const token = newToken(savedUser);
        console.log(savedUser);
        res.json({
            token,
            user:{
                id:savedUser._id,
                email: savedUser.email,
                username : savedUser.username
            }
        })

    }catch (e) {
        res.status(500).json({e: e.message});
    }
  
});

userRoutes.post('/signin' , async (req,res)=>{
  const {email,password} = req.body;
  try {
      if(!email || !password){
          return res.status(400).json({msg : 'Need username and password'})
      }
      const user = await User.findOne({email : email});
      if(!user){
          return res.status(401).json({msg : 'No account with this email has been registered'})
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if(!isMatch) return res.status(400).json({msg: "Invalid credentials."})
      const token = jwt.sign({id: user._id}, process.env.JWT_TOKEN);
      res.json({
          token,
          user:{
              id: user._id,
              email: user.email,
              username : user.username
          }
      });



  }catch (e) {
      res.status(500).json({e: e.message})
  }




});


userRoutes.post("/tokenIsValid", async (req, res) => {
    try {
        const token = req.header("x-access-token");
        if (!token) return res.json(false);

        const verified = jwt.verify(token, process.env.JWT_TOKEN);

        if (!verified) return res.json(false);

        const user = await User.findById(verified.id);
        if (!user) return res.json(false);

        return res.json(true);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = userRoutes;