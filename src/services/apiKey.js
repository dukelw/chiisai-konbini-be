const ApiKeyModel = require("../models/ApiKey");
const crypto = require("crypto");

const findById = async (key) => {
  // const newKey = await ApiKeyModel.create({
  //   key: crypto.randomBytes(64).toString("hex"),
  //   permissions: ["0000"],
  // });
  // console.log(newKey);
  const objKey = await ApiKeyModel.findOne({ key, status: true }).lean();
  return objKey;
};

module.exports = {
  findById,
};
