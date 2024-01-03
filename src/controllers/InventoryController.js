const InventoryService = require("../services/inventory");
const { SuccessResponse } = require("../core/successResponse");

class InventoryController {
  // Create
  async addStock(req, res, next) {
    new SuccessResponse({
      message: "Add stock to inventory success",
      metadata: await InventoryService.addStockToInventory({ ...req.body }),
    }).send(res);
  }
}

module.exports = new InventoryController();
