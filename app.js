const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');

const app = express();

const port = 3000;
//MIDDLEWARE SETUP

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));

//ROUTES

app.use('/api',require('./routes/user-routes'));
app.use('/api', require('./routes/wallet-routes'));

app.listen(port , () => console.log("Server runing "));

