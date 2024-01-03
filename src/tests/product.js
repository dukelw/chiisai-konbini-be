const redisPubSubService = require("../services/redisPubsub");

class ProductServiceTest {
  purchaseProduct(product_id, quantity) {
    const order = {
      product_id,
      quantity,
    };
    console.log("Product_ID", product_id);

    redisPubSubService.publish("purchase_events", JSON.stringify(order));
  }
}

module.exports = new ProductServiceTest();
