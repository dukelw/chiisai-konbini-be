const CartService = require("../services/cart");
const { SuccessResponse } = require("../core/successResponse");

class CartController {
  // Create
  async create(req, res, next) {
    new SuccessResponse({
      message: "Create new cart success",
      // Also can write metadata: await CartService.addToCart(req.body)
      metadata: await CartService.addToCart({ ...req.body }),
    }).send(res);
  }

  // Update
  async update(req, res, next) {
    new SuccessResponse({
      message: "Update cart success",
      metadata: await CartService.addToCartV2({ ...req.body }),
    }).send(res);
  }

  // Delete
  async delete(req, res, next) {
    new SuccessResponse({
      message: "Delete cart success",
      metadata: await CartService.deleteUserCartItem({ ...req.body }),
    }).send(res);
  }

  // Query
  async listToCart(req, res, next) {
    new SuccessResponse({
      message: "List to cart success",
      metadata: await CartService.getListUserCart(req.query),
    }).send(res);
  }
}

module.exports = new CartController();
