/* Cart Service
  1 - Add product to cart [User]
  2 - Reduce product quantity by one [User]
  3 - Increase product quantity by one [User]
  4 - Get cart [User]
  5 - Delete cart [User]
  6 - Delete cart item [User]
*/

const { NotFoundError } = require("../core/errorResponse");
const { cart: CartModel } = require("../models/Cart");
const {
  createUserCart,
  updateUserCartQuantity,
  checkProductInCart,
} = require("../models/repositories/Cart");
const { getProductByID } = require("../models/repositories/Product");

class CartService {
  static async addToCart({ user_id, product = {} }) {
    // Check cart existence
    const userCart = await CartModel.findOne({ cart_user_id: user_id });
    if (!userCart) {
      // Create new cart for User
      return await createUserCart({ user_id, product });
    }

    // If having cart but no product in it
    if (!userCart.cart_products.length) {
      userCart.cart_products = [product];
      return await userCart.save();
    } else if (
      userCart.cart_products.length &&
      !checkProductInCart({
        card_products: userCart.cart_products,
        product_id: product.product_id,
      })
    ) {
      userCart.cart_products = [...userCart.cart_products, product];
      return await userCart.save();
    }

    // If having cart and and having this product, increase it by 1
    return await updateUserCartQuantity({ user_id, product });
  }

  // updateCart
  /*
    shop_order_ids: [
      {
        shop_id,
        item_products: [
          {
            quantity,
            price,
            shop_id,
            old_quantity,
            product_id
          }
        ],
        version
      }
    ]
  */

  static async addToCartV2({ user_id, shop_order_ids = {} }) {
    const { product_id, quantity, old_quantity } =
      shop_order_ids[0]?.item_products[0];
    // Check product
    const foundProduct = await getProductByID(product_id);
    if (!foundProduct) throw new NotFoundError("Product does not exist");
    if (foundProduct.product_shop.toString() !== shop_order_ids[0]?.shop_id)
      throw new NotFoundError("Product does not belong to shop");
    if (quantity === 0) {
      // Delete
    }
    return await updateUserCartQuantity({
      user_id,
      product: {
        product_id,
        quantity: quantity - old_quantity,
      },
    });
  }

  static async deleteUserCartItem({ user_id, product_id }) {
    const query = {
        cart_user_id: user_id,
        cart_state: "active",
      },
      updateSet = {
        $pull: {
          cart_products: {
            product_id,
          },
        },
      };
    const deleteCart = await CartModel.updateOne(query, updateSet);
    return deleteCart;
  }

  static async getListUserCart({ user_id }) {
    return await CartModel.findOne({
      cart_user_id: user_id,
    }).lean();
  }
}

module.exports = CartService;
