require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const withAuth = require("./middlewares/withAuth");
const path         = require('path');

const app = express();

const port = process.env.PORT;

mongoose
      .connect( process.env.DB_PROD, {useNewUrlParser: true})
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
/*
app.use(cors({
  credentials : true,
  origin: ['http://localhost:3000'] 
}));

*/

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", '*');
    res.header("Access-Control-Allow-Credentials", true);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
    next();
});

// Set up a whitelist and check against it:
const whitelist = ['http://localhost:3000', 'http://example2.com']
const corsOptions = {
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    }
}

// Then pass them to cors:
app.use(cors(corsOptions));
app.use(cookieParser());


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));



const index = require('./routes/index');
app.use('/',index)

app.use('/api',require('./routes/user-routes'));

//ROUTES


app.use('/api',withAuth, require('./routes/wallet-routes'));

app.listen(port , () => console.log("Server runing "));

