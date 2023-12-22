const { inventory: InventoryModel } = require("../Inventory");

const { Types } = require("mongoose");

const insertInventory = async ({
  product_id,
  shop_id,
  stock,
  location = "unknown",
}) => {
  return await InventoryModel.create({
    inven_productID: product_id,
    inven_stock: stock,
    inven_location: location,
    inven_shopID: shop_id,
  });
};

module.exports = {
  insertInventory,
};
