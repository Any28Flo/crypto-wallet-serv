const express = require('express');
const cryptoRoutes = express.Router();

const Crypto = require('./../models/cripto-model');
const Wallet = require('./../models/wallet-model');

cryptoRoutes.post('/crypto', (req,res) =>{
    const {idCrypto, amount, walletId} = req.body;
    Crypto.create({
        name: idCrypto,
        quantity : amount,
        wallet : walletId
    })
    .then(response  =>{
        console.log(response)
        return Wallet.findByIdAndUpdate(walletId,{
            $push: { coins: response._id }
        })
    })
        .then(theWallet =>{
            res.status(200).json(theWallet)

        })
        .catch(err => {
            res.json(err);
        });

});
module.exports = cryptoRoutes;