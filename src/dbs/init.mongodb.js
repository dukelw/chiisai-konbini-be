'use strict'

const mongoose = require("mongoose")
const connectString = `mongodb://localhost:27017/chiisai_konbini_dev`;

class Database {
  constructor() {
    this.connect()
  }

  // connect
  connect(type = 'mongodb') {
    if (1 === 1) {
      mongoose.set('debug', true)
      mongoose.set('debug', { color: true })
    }
    mongoose
      .connect(connectString)
      .then((_) => console.log("Connect DB successfully!"))
      .catch((err) => console.log("Connect failed!"));
  }

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database()
    }

    return Database.instance
  }
}

const instanceMongoDB = Database.getInstance()
module.exports = instanceMongoDB