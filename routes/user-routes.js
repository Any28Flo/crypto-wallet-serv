const express = require('express');
const userRoutes = express.Router();

const User = require('../models/user-model');

const controller = (req, res) =>{
  res.send({"message" : " Jonh Snow"})
}

userRoutes.post('/signup' , controller)

userRoutes.get('/login' , controller);

userRoutes.post('/logout' , (req, res) =>{
  console.log(req.body);
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