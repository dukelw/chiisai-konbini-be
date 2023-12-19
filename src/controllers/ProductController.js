const ProductService = require("../services/product");
const { SuccessResponse } = require("../core/successResponse");

class ProductController {
  async create(req, res, next) {
    console.log(req.user)
    new SuccessResponse({
      message: "Create new product success",
      metadata: await ProductService.createProduct(req.body.product_type, {
        ...req.body,
        product_shop: req.user.userID,
      }),
    }).send(res);
  }
}

module.exports = new ProductController();
