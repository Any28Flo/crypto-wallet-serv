const express = require('express');
const walletRoutes = express.Router();

const Wallet = require('./../models/wallet-model');



walletRoutes.post('/wallets' , (req, res) =>{

 const {walletName , description, coins, createdBy} = req.body;

 if(!walletName|| !description || !coins || !createdBy){
  return res.status(400).send({message : 'Please fill in all the fields of the form '})
 }
 const newWallet = new Wallet({
  name : walletName,
  description : description,
  coins : [],
  createdBy : createdBy
 });
 
newWallet.save( err =>{
 if(err){
  res.status(400).json({'message' : 'Saving wallet to database went wrong'});
  return;
 }
 res.status(200).json({'message' : 'Saving new wallet sucefully'})
})
});

/*walletRoutes.get('/wallets' , (req , res) =>{

});

walletRoutes.put('/wallets/:id' , (req, res) =>{

});

walletRoutes.delete('wallets/:id' , (req, res) =>{

});*/

module.exports = walletRoutes;