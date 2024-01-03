const { convertToObjectIDMongo } = require("../../utils");
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

const reservationInventory = async ({ product_id, quantity, cart_id }) => {
  const query = {
      inven_productID: convertToObjectIDMongo(product_id),
      inven_stock: { $gte: quantity },
    },
    updateSet = {
      $inc: {
        inven_stock: -quantity,
      },
      $push: {
        inven_reservation: {
          quantity,
          cart_id,
          createOn: new Date(),
        },
      },
    },
    options = { upsert: true, new: true };
  return await InventoryModel.updateOne(query, updateSet, options);
};

module.exports = {
  insertInventory,
  reservationInventory,
};
