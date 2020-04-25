const express = require('express');
const walletRoutes = express.Router();
const five = require("johnny-five");
const Wallet = require('./../models/wallet-model');

walletRoutes.post('/wallets' , (req, res) =>{

 const {walletName , description, coins, createdBy} = req.body;

 if(!walletName|| !description || !coins || !createdBy){
  return res.status(400).json({message : 'Please fill in all the fields of the form '})
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
   res.status(200).json({'message' : 'Saving new wallet sucefully', })
 })
});

walletRoutes.get('/wallets' , (req , res) =>{
 const createdBy= req.query.createdBy;

 Wallet.find({'createdBy' :  createdBy })
     .populate('coins')
     .then( wallets =>{

      res.status(200).json({'message' :'Cypto List' , wallets: wallets})
     })
     .catch(e => console.log(e))
});


walletRoutes.post('/price ', (req,res) =>{
 const {name, price} = req.body;
 console.log("Hola")
 console.log(name,price);
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
   lcd.clear().print(name);
   lcd.clear();
   lcd.cursor(1, 2);
   lcd.clear().print(price);


   this.repl.inject({
    lcd: lcd
   });

  });

})
module.exports = walletRoutes;