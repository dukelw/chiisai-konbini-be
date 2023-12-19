// const ProductService = require("../services/product");
const ProductServicePro = require("../services/productPro");
const { SuccessResponse } = require("../core/successResponse");

class ProductController {
  // async create(req, res, next) {
  //   new SuccessResponse({
  //     message: "Create new product success",
  //     metadata: await ProductService.createProduct(req.body.product_type, {
  //       ...req.body,
  //       product_shop: req.user.userID,
  //     }),
  //   }).send(res);
  // }

  async create(req, res, next) {
    new SuccessResponse({
      message: "Create new product success",
      metadata: await ProductServicePro.createProduct(req.body.product_type, {
        ...req.body,
        product_shop: req.user.userID,
      }),
    }).send(res);
  }
}

module.exports = new ProductController();
