const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');

const app = express();

const port = 3000;
//MIDDLEWARE

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));

//ROUTES

app.get('/', log, (req,res) =>{
    res.send({'message' : 'hello'})
});
app.post('/' , (req, res) =>{

    console.log(req.body);
    res.send({'message' : 'ok'})
});

app.listen(port , () => console.log("Server runing "));

