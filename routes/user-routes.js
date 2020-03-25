const express = require('express');
const userRoutes = express.Router();
const bcrypt  = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user-model');

const newToken = User =>{
 return jwt.sign({id : User.id}  , 'winteriscomming' , {
    expiresIn:  86400
  });
};

 const verifyToken = token =>{
  new Promise((resolve, reject) =>{
    jwt.verify(token , 'winteriscomming' , (err, payload) =>{
      if(err) return reject(err)
      resolve(payload)
    })
  })
};
userRoutes.post('/signup' , (req, res) =>{
  const username= req.body.username;
  const password = req.body.password;
  const email = req.body.email;
  const image = req.body.image;
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
    console.log(newUser)
     newUser.save( err =>{
       if(err){
         res.status(400).json({'message' : 'Saving user to database went wrong'})
         return;
       }
       const token = newToken(newUser);
       console.log(token)
       res.status(200).send({token});

     })

  }))
  
  
});
userRoutes.post('/signin' , (req,res)=>{
  const username = req.body.username;
  const password = req.body.password;
  if(!username || !password){
    return res.status(400).send({message : 'need username and password'})
  }
  const invalid = { message : ' Invalid email and password combination'}

 const user =  User.findOne({email : email})
  .select('email password')
  .exec()

  if(!user){
    return res.status(401).send(invalid)
  }
  const match = user.checkPassword(password)
  console.log(match)


})
/*

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
*/

module.exports = userRoutes;