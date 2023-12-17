const mongoose = require("mongoose");
const os = require("os");
const SECOND = 5000;
// check connect
const countConnect = () => {
  const numConnection = mongoose.connections.length;
  console.log("Number of connections::", numConnection);
};

// check overload
const checkOverload = () => {
  setInterval(() => {
    const numConnection = mongoose.connections.length;
    const numCore = os.cpus().length;
    const memoryUsage = process.memoryUsage().rss;
    const maxConnections = numCore * 5;
    console.log(`Active connections:${numConnection}`);
    console.log(`Memory usage:: ${memoryUsage / 1024 / 1024} MB`);

    if (numConnection > maxConnections) {
      console.log("Connection overload detected");
    }
  }, SECOND);
};

module.exports = {
  countConnect,
  checkOverload,
};
