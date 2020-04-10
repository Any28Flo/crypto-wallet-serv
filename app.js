require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const withAuth = require("./middlewares/withAuth");
const app = express();

const port = process.env.PORT;

mongoose
      .connect( process.env.DB_DEV, {useNewUrlParser: true})
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
app.use(cookieParser());


app.use('/api',require('./routes/user-routes'));

//ROUTES


app.use('/api',withAuth, require('./routes/wallet-routes'));

app.listen(port , () => console.log("Server runing "));

