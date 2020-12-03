const express = require('express');
const passport = require('passport');
const morgan = require('morgan')
const cors = require('cors');
const app = express();

// Config dotev
require('dotenv').config({
    path: './config/config.env'
})

// Core and Morgan
if (process.env.NODE_ENV === 'development') {
    app.use(cors({
        origin: process.env.CLIENT_URL
    }))
    
    app.use(morgan('dev'))
}

app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

// Connect to database
const connectDB = require('./config/db')
connectDB();

// Express body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// OpenApi
require('./api')(app);

// Passport Config
require('./passport')(passport);

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server started on port ${PORT}`));
