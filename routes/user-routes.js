const express = require('express');
const userRoutes = express.Router();
const bcrypt  = require('bcrypt');

const User = require('../models/user-model');

const controller = (req, res) =>{
  res.send({"message" : " Jonh Snow"})
}

userRoutes.post('/signup' , (req, res) =>{
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;
  const image = req.body.image;

  if(!username || !password || !email ){
    res.status(400).json({'message' : 'Fill all inputs'});
    return
  }
  if(password.length < 7){
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
       res.status(200).json(newUser);

     })

  }))
});

userRoutes.get('/login' , controller);

userRoutes.post('/logout' , (req, res) =>{
    res.send({'logout' : 'id:111231'})
});

userRoutes.get('/loggedin' , (req, res) =>{
  res.send({'logout' : 'sucess'})
})

userRoutes.put('/:id' , (req, res) =>{

})

userRoutes.delete('/:id' , (req, res) =>{
  
})

module.exports = userRoutes;