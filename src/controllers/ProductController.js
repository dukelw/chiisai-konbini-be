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

  // Update product
  async update(req, res, next) {
    new SuccessResponse({
      message: "Update product success",
      metadata: await ProductServicePro.updateProduct(
        req.body.product_type,
        req.params.product_id,
        {
          ...req.body,
          product_shop: req.user.userID,
        }
      ),
    }).send(res);
  }

  async publishProductByShop(req, res, next) {
    new SuccessResponse({
      message: "Publish product success",
      metadata: await ProductServicePro.publishProductByShop({
        product_id: req.params.id,
        product_shop: req.user.userID,
      }),
    }).send(res);
  }

  async unPublishProductByShop(req, res, next) {
    new SuccessResponse({
      message: "Unpublish product success",
      metadata: await ProductServicePro.unPublishProductByShop({
        product_id: req.params.id,
        product_shop: req.user.userID,
      }),
    }).send(res);
  }

  // Query
  /**
   * @dest Get all drafts for shop
   * @param {Number} limit
   * @param {Number} skip
   * @return {JSON}
   */
  async getAllDraftsForShop(req, res, next) {
    new SuccessResponse({
      message: "Get drafts success",
      metadata: await ProductServicePro.findAllDraftsForShop({
        product_shop: req.user.userID,
      }),
    }).send(res);
  }

  /**
   * @dest Get all drafts for shop
   * @param {Number} limit
   * @param {Number} skip
   * @return {JSON}
   */
  async getAllPublishForShop(req, res, next) {
    new SuccessResponse({
      message: "Get publish success",
      metadata: await ProductServicePro.findAllPublishForShop({
        product_shop: req.user.userID,
      }),
    }).send(res);
  }

  async getListSearchProduct(req, res, next) {
    new SuccessResponse({
      message: "Get list search product success",
      metadata: await ProductServicePro.searchProduct(req.params),
    }).send(res);
  }

  async findAllProducts(req, res, next) {
    new SuccessResponse({
      message: "Find all product success",
      metadata: await ProductServicePro.findAllProducts(req.query),
    }).send(res);
  }

  async findProduct(req, res, next) {
    new SuccessResponse({
      message: "Find product by id success",
      metadata: await ProductServicePro.findProduct({
        product_id: req.params.product_id,
      }),
    }).send(res);
  }
}

module.exports = new ProductController();
