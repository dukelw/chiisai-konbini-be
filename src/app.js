require("dotenv").config();
const compression = require("compression");
const express = require("express");
const { default: helmet } = require("helmet");
const morgan = require("morgan");
const app = express();
const route = require("./routes");

// Init middleware
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

// Test pub sub redis
// For some reason error occur so I comment
// const productTest = require("./tests/product");
// productTest.purchaseProduct("product:001", 10);
// require("./tests/inventory");

// Init db
require("./dbs/init.mongodb");
const { countConnect, checkOverload } = require("./helpers/check.connect");
countConnect();
// checkOverload()

// Init routes
route(app);

// Handling error
app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  const statusCode = error.status || 500;
  return res.status(statusCode).json({
    status: "error",
    code: statusCode,
    message: error.message || "Internal Server Error",
  });
});

module.exports = app;
