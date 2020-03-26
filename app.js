require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');
const protect =  require( "./middlewares/auth");

const app = express();

const port = 5000;

mongoose
      .connect('mongodb://localhost/crypto-wallet-serv', {useNewUrlParser: true})
      .then(x => {
            console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
          })
          .catch(err => {
            console.error('Error connecting to mongo', err)
          });
      

//MIDDLEWARE SETUP

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(cors({
  credentials : true,
  origin: ['http://localhost:3000'] 
}));


app.use('/api',require('./routes/user-routes'));

//ROUTES

app.use('/api', protect);
app.use('/api', require('./routes/wallet-routes'));

app.listen(port , () => console.log("Server runing "));

