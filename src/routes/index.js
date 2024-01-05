const siteRouter = require("./site");
const shopRouter = require("./shop");
const productRouter = require("./product");
const discountRouter = require("./discount");
const cartRouter = require("./cart");
const checkoutRouter = require("./checkout");
const inventoryRouter = require("./inventory");
const commentRouter = require("./comment");
const notificationRouter = require("./notification");
const { apiKey, permission } = require("../auth/checkAuth");
const { pushToLogDiscord } = require("../middlewares/index");

function route(app) {
  // Add log to discord
  app.use(pushToLogDiscord);
  // Check API key, if user does not have an API Key, they can not use my API
  app.use(apiKey);
  // Check their permission
  app.use(permission("0000"));
  app.use("/shop", shopRouter);
  app.use("/product", productRouter);
  app.use("/discount", discountRouter);
  app.use("/cart", cartRouter);
  app.use("/checkout", checkoutRouter);
  app.use("/inventory", inventoryRouter);
  app.use("/comment", commentRouter);
  app.use("/notification", notificationRouter);
  app.use("/", siteRouter);
}

module.exports = route;
