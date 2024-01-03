const { findCartByID } = require("../models/repositories/Cart");
const { checkProductByServer } = require("../models/repositories/Product");
const DiscountService = require("../services/discount");
const { BadRequestError, NotFoundError } = require("../core/errorResponse");
const { acquireLock, releaseLock } = require("./redis");
const { order: OrderModel } = require("../models/Order");
class CheckoutService {
  /*
    {
      cart_id,
      user_id,
      shop_order_ids: [
        {
          shop_id,
          shop_discounts: [],
          item_products: [
            {
              price,
              quantity,
              product_id
            }
          ]
        },
        {
          shop_id,
          shop_discounts: [],
          item_products: [
            {
              price,
              quantity,
              product_id
            }
          ]
        }
      ]
    }
  */

  static async checkoutReview({ cart_id, user_id, shop_order_ids }) {
    // Check cart_id existence
    const foundCart = await findCartByID({ cart_id });

    if (!foundCart) throw new NotFoundError("Cart does not exist");
    const checkout_order = {
        totalPrice: 0,
        feeShip: 0,
        totalDiscount: 0,
        totalCheckout: 0,
      },
      shop_order_ids_new = [];

    // Calculate bill
    for (let i = 0; i < shop_order_ids.length; i++) {
      const {
        shop_id,
        shop_discounts = [],
        item_products = [],
      } = shop_order_ids[i];

      // Check product available
      const checkProductServer = await checkProductByServer(item_products);
      console.log("Check product by server", checkProductServer);
      if (!checkProductServer[0]) throw new BadRequestError("Order wrong");

      // Bill of order
      const checkoutPrice = checkProductServer.reduce((acc, product) => {
        return acc + product.quantity * product.price;
      }, 0);
      console.log("checkoutPrice", checkoutPrice);

      // Bill of order before applying discounts and shipping fee
      checkout_order.totalPrice += checkoutPrice;

      const itemCheckout = {
        shop_id,
        shop_discounts,
        rawPrice: checkoutPrice,
        appliedDiscountsPrice: checkoutPrice,
        item_products: checkProductServer,
      };

      // If shop discounts > 0, check validate
      if (shop_discounts.length > 0) {
        const { totalPrice = 0, discount = 0 } =
          await DiscountService.getDiscountAmount({
            code: shop_discounts[0].code,
            user_id,
            shop_id,
            products: checkProductServer,
          });

        // Sum discounts
        checkout_order.totalDiscount += discount;

        // If discount > 0
        if (discount > 0)
          itemCheckout.appliedDiscountsPrice = checkoutPrice - discount;
      }

      // Final bill
      checkout_order.totalCheckout += itemCheckout.appliedDiscountsPrice;
      shop_order_ids_new.push(itemCheckout);
    }

    return {
      shop_order_ids,
      shop_order_ids_new,
      checkout_order,
    };
  }

  // Order
  static async orderByUser({
    shop_order_ids,
    cart_id,
    user_id,
    user_address = {},
    user_payment = {},
  }) {
    const { shop_order_ids_new, checkout_order } =
      await CheckoutService.checkoutReview({
        cart_id,
        user_id,
        shop_order_ids,
      });

    // One more check inventory of product
    // Get new array Product by flatmap
    const products = shop_order_ids_new.flatMap((order) => order.item_products);
    const acquireProduct = [];
    console.log(`[1] Products::`, products);
    for (let i = 0; i < products.length; i++) {
      // if (!products[0]) throw new BadRequestError();
      const { product_id, quantity } = products[i];
      const keyLock = await acquireLock(product_id, quantity, cart_id);
      acquireProduct.push(keyLock ? true : false);
      if (keyLock) {
        await releaseLock(keyLock);
      }
    }

    // Check if some product is out of stock
    if (acquireProduct.includes(false)) {
      throw new BadRequestError(
        "Some products have been update recently, please go to cart again"
      );
    }

    const newOrder = await OrderModel.create({
      order_user_id: user_id,
      order_checkout: checkout_order,
      order_shipping: user_address,
      order_payment: user_payment,
      order_products: shop_order_ids_new,
    });

    // If insert successfully, remove products from cart
    if (newOrder) {
    }

    return newOrder;
  }

  /*
    1. Query Orders [User]
  */
  static async getOrderByUser() {}

  /*
    2. Query Orders Using ID [User]
  */
  static async getOneOrderByUser() {}

  /*
    3. Cancel Orders [User]
  */
  static async cancelOrderByUser() {}

  /*
    4. Update Orders Status [Shop | Admin]
  */
  static async updateOrderStatusByShop() {}
}

module.exports = CheckoutService;
