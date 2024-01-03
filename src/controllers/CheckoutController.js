const CheckoutService = require("../services/checkout");
const { SuccessResponse } = require("../core/successResponse");

class CheckoutController {
  // Create
  async review(req, res, next) {
    new SuccessResponse({
      message: "Checkout review success",
      metadata: await CheckoutService.checkoutReview({ ...req.body }),
    }).send(res);
  }

}

module.exports = new CheckoutController();
