const express = require('express');
const walletRoutes = express.Router();

const Wallet = require('./../models/wallet-model');


walletRoutes.post('/wallets' , (req, res) =>{

});

walletRoutes.get('/wallets' , (req , res) =>{

});

walletRoutes.put('/wallets/:id' , (req, res) =>{

});

walletRoutes.delete('wallets/:id' , (req, res) =>{

});

module.exports = walletRoutes