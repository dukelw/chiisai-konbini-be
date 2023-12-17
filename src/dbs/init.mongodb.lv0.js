const mongoose = require("mongoose");
const connectString = `mongodb://localhost:27017/chiisai_konbini_dev`;

mongoose
  .connect(connectString)
  .then((_) => console.log("Connect to DB successfully!"))
  .catch(err => console.log("Connect failed!"));

module.exports = mongoose;
