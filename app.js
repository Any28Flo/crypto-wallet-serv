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

const PORT = process.env.PORT;

mongoose
      .connect(process.env.DB_PROD, {useNewUrlParser: true, useUnifiedTopology : true, useCreateIndex: true})
      .then(x => {
            console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
          })
          .catch(err => {
            console.error('Error connecting to mongo', err)
          });


app.use(cors({
    credentials : true,
    origin: ['http://localhost:3000', 'https://crypto-wallet-client.herokuapp.com/']
}));

//MIDDLEWARE SETUP

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));




app.use(cookieParser());


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));


const index = require('./routes/index');

app.use('/',index);

app.use('/api',require('./routes/user-routes'));

//ROUTES


app.use('/api',withAuth, require('./routes/wallet-routes'));
app.use('/api', withAuth, require('./routes/crypto-routes'));

app.listen(PORT , () => console.log("Server runing "));

