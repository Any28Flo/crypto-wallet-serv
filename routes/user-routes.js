require('dotenv').config();

const express = require('express');
const userRoutes = express.Router();
const bcrypt  = require('bcrypt');
const jwt = require('jsonwebtoken');
const withAuth = require('./../middlewares/auth');
const User = require('../models/user-model');

const newToken = User =>{
 return jwt.sign({id : User.id}  , process.env.SESSION_SECRET , {
    expiresIn:  86400
  });
};


userRoutes.post('/signup' , (req, res) =>{
  const { username, password, email, image} = req.body;

  if(!req.body.username || !req.body.password || !req.body.email){
    return res.status(400).send({message : 'Need email and password'})
  }
  if(req.body.password.length < 7){
    res.status(400).json({'message' : 'Make your password at least 8 characters long for security purposes.'});
    return
  }
  User.findOne( User.findOne({username} , (err , foundUser) =>{
    if(err){
      res.status(500).json({'message' : 'Username check went bad.'});
      return
    }
    if(foundUser){
      res.status(400).json({'message' : 'Username taken. Choose another one.'});
      return
    }

    const salt     = bcrypt.genSaltSync(10);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = new User({
      username :username,
      password:hashPass,
      email:email,
      image:image
    });
     newUser.save( err =>{
       if(err){
         res.status(400).json({'message' : 'Saving user to database went wrong'})
         return;
       }
       const token = newToken(newUser);
       res.status(200).send({newUser, token});

     })

  }))
  
  
});
userRoutes.post('/signin' , (req,res)=>{
  const {email,password} = req.body;
  if(!email || !password){
    return res.status(400).send({message : 'need username and password'})
  }

  User.findOne({email : email}, (err, user) =>{
    console.log(user)
    if(err){
      console.error(err);
      res.status(500).json({ 'error' : 'Internal error please try again'});

    }else if(!user){
      return res.status(401).json({'message' : 'Incorrect email or password'})
    }else{
      user.checkPassword(password, (err, same) =>{
        console.log(err)
        console.log(same)
        if(err){
          res.status(500).json({'message' : 'Internal error please try again'})
        }else if(!same){

          res.status(401).json({'message' : 'Incorrect email or password'})
        }else{
          const payload = {email};
          const token = jwt.sign(payload, process.env.SESSION_SECRET ,{
          expiresIn:'1h'
      });
      //

         // localStorage.setItem("JWT", token);
          //res.
       /*res.cookie('access_token', 'Bearer ' + token, {
            expires: new Date(Date.now() + 8 * 3600000) // cookie will be removed after 8 hours
          })*/
        res.cookie('token', {user, token}, { httpOnly: true }).status(200).send({user, token})

        }

      } )
    }
  });

});



module.exports = userRoutes;