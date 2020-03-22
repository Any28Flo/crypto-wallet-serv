require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

const port = 3000;

mongoose
      .connect('mongodb://localhost/crypto-wallet-serv', {useNewUrlParser: true})
      .then(x => {
            console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
          })
          .catch(err => {
            console.error('Error connecting to mongo', err)
          });
      

//MIDDLEWARE SETUP

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));

//ROUTES

app.use('/api',require('./routes/user-routes'));
app.use('/api', require('./routes/wallet-routes'));

app.listen(port , () => console.log("Server runing "));

