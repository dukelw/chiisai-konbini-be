const redisPubSubService = require("../services/redisPubsub");

class InventoryServiceTest {
  constructor() {
    redisPubSubService.subscribe("purchase_events", (channel, message) => {
      InventoryServiceTest.updateInventory(message);
    });
  }

  static updateInventory(product_id, quantity) {
    console.log(`Update inventory ${product_id} with quantity ${quantity}`);
  }
}

module.exports = new InventoryServiceTest();
