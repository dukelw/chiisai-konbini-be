const { BadRequestError } = require("../core/errorResponse");
const { inventory: InventoryModel } = require("../models/Inventory");
const { getProductByID } = require("../models/repositories/Product");

class InventoryService {
  static async addStockToInventory({
    stock,
    product_id,
    shop_id,
    location = "An Giang",
  }) {
    const product = getProductByID(product_id);
    if (!product) throw new BadRequestError("The product does not exists");

    const query = { inven_shopID: shop_id, inven_productID: product_id },
      updateSet = {
        $inc: {
          inven_stock: stock,
        },
        $set: {
          inven_location: location,
        },
      },
      options = {
        upsert: true,
        new: true,
      };

    return await InventoryModel.findOneAndUpdate(query, updateSet, options);
  }
}

module.exports = InventoryService;
