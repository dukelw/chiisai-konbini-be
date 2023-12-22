const DiscountService = require("../services/discount");
const { SuccessResponse } = require("../core/successResponse");

class DiscountController {
  async create(req, res, next) {
    new SuccessResponse({
      message: "Create new discount success",
      metadata: await DiscountService.createDiscountCode({
        ...req.body,
        shop_id: req.user.userID,
      }),
    }).send(res);
  }

  // Update discount
  async update(req, res, next) {
    new SuccessResponse({
      message: "Update discount code success",
      metadata: await DiscountService.updateDiscountCode(
        req.user.userID,
        req.params.discount_code,
        {
          ...req.body,
          discount_shop_id: req.user.userID,
        }
      ),
    }).send(res);
  }

  async getAllDiscountCodesWithProduct(req, res, next) {
    new SuccessResponse({
      message: `Get all discount codes with product success`,
      metadata: await DiscountService.getAllDiscountCodesWithProduct({
        ...req.query,
      }),
    }).send(res);
  }

  async getAllDiscountCodesOfShop(req, res, next) {
    new SuccessResponse({
      message: `Get all discount codes of shop ${req.user.userID} success`,
      metadata: await DiscountService.getAllDiscountCodesOfShop({
        ...req.query,
        shop_id: req.user.userID,
      }),
    }).send(res);
  }

  async getDiscountAmount(req, res, next) {
    console.log("Body", req.body)
    new SuccessResponse({
      message: `Get discount amount success`,
      metadata: await DiscountService.getDiscountAmount({
        ...req.body
      }),
    }).send(res);
  }

  async deleteDiscountCode(req, res, next) {
    console.log("Delte", req.params.code, req.user.userID);
    new SuccessResponse({
      message: `Delete discount code ${req.params.code} success`,
      metadata: await DiscountService.deleteDiscountCode({
        shop_id: req.user.userID,
        code: req.params.code,
      }),
    }).send(res);
  }

  async cancelDiscountCode(req, res, next) {
    new SuccessResponse({
      message: `Delete discount code ${req.body.code} success`,
      metadata: await DiscountService.cancelDiscountCode({
        shop_id: req.params.shop_id,
        code: req.body.code,
        user_id: req.body.user_id,
      }),
    }).send(res);
  }
}

module.exports = new DiscountController();
