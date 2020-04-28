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
        res.status(500).json({e: e.message});
    }
  
});

userRoutes.post("/signin", async (req, res) => {
    try {
        const { email, password } = req.body;

        // validate
        if (!email || !password)
            return res.status(400).json({ msg: "Not all fields have been entered." });

        const user = await User.findOne({ email: email });
        if (!user)
            return res
                .status(400)
                .json({ msg: "No account with this email has been registered." });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: "Invalid credentials." });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        res.json({
            token,
            user: {
                id: user._id,
                displayName: user.displayName,
                email: user.email,
            },
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});



module.exports = userRoutes;