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
