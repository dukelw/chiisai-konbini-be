const { cart: CartModel } = require("../Cart");
const { convertToObjectIDMongo } = require("../../utils/index");

const createUserCart = async ({ user_id, product }) => {
  const query = { cart_user_id: user_id, cart_state: "active" },
    updateOrInsert = {
      $addToSet: {
        cart_products: product,
      },
    },
    options = { upsert: true, new: true };
  return await CartModel.findOneAndUpdate(query, updateOrInsert, options);
};

const updateUserCartQuantity = async ({ user_id, product }) => {
  const { product_id, quantity } = product;
  const query = {
      cart_user_id: user_id,
      "cart_products.product_id": product_id,
      cart_state: "active",
    },
    updateSet = {
      $inc: {
        "cart_products.$.quantity": quantity,
      },
    },
    options = { upsert: true, new: true };
  return await CartModel.findOneAndUpdate(query, updateSet, options);
};

const checkProductInCart = ({ card_products, product_id }) => {
  return card_products.some((cart_product) => {
    return cart_product.product_id === product_id;
  });
};

const findCartByID = async ({ cart_id }) => {
  return await CartModel.findOne({
    _id: convertToObjectIDMongo(cart_id),
    cart_state: "active",
  }).lean();
};

module.exports = {
  createUserCart,
  updateUserCartQuantity,
  checkProductInCart,
  findCartByID,
};
