const siteRouter = require("./site");
const shopRouter = require("./shop");
const productRouter = require("./product");
const discountRouter = require("./discount");
const { apiKey, permission } = require("../auth/checkAuth");

function route(app) {
  // Check API key, if user does not have an API Key, they can not use my API
  app.use(apiKey);
  // Check their permission
  app.use(permission("0000"));
  app.use("/shop", shopRouter);
  app.use("/product", productRouter);
  app.use("/discount", discountRouter);
  app.use("/", siteRouter);
}

module.exports = route;
