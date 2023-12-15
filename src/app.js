const compression = require('compression');
const express = require('express');
const { default: helmet } = require('helmet');
const morgan = require('morgan');
const app = express();

// Init middleware
app.use(morgan('dev'))
app.use(helmet())
app.use(compression())

// Init db

// Init routes
app.get('/', (req, res, next) => {
  res.send('Hello world')
})

// Handling error

module.exports = app
