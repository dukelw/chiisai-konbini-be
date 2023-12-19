const {
  product: ProductModel,
  clothes: ClothesModel,
  electronic: ElectronicModel,
  furniture: FurnitureModel,
} = require("../models/Product");
const { BadRequestError } = require("../core/errorResponse");

// Defined factory class to create Product
class ProductFactory {
  static async createProduct(type, payload) {
    switch (type) {
      case "Electronic":
        return new Electronic(payload).createProduct();
      case "Clothes":
        return new Clothes(payload).createProduct();
      case "Furniture":
        return new Furniture(payload).createProduct();
      default:
        throw new BadRequestError("Invalid product type", type);
    }
  }
}

class Product {
  constructor({
    product_name,
    product_thumb,
    product_description,
    product_price,
    product_quantity,
    product_type,
    product_shop,
    product_attributes,
  }) {
    (this.product_name = product_name),
      (this.product_thumb = product_thumb),
      (this.product_description = product_description),
      (this.product_price = product_price),
      (this.product_quantity = product_quantity),
      (this.product_type = product_type),
      (this.product_shop = product_shop),
      (this.product_attributes = product_attributes);
  }

  // Create new product
  async createProduct(product_id) {
    return await ProductModel.create({ ...this, _id: product_id });
  }
}

// Create sub-class for different product types Clothes
class Clothes extends Product {
  async createProduct() {
    const newClothes = await ClothesModel.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newClothes) throw new BadRequestError("Create new clothes error");

    const newProduct = await super.createProduct(newClothes._id);
    if (!newProduct) throw new BadRequestError("Create new product error");

    return newProduct;
  }
}

// Create sub-class for different product types Electronic
class Electronic extends Product {
  async createProduct() {
    const newElectronic = await ElectronicModel.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newElectronic)
      throw new BadRequestError("Create new electronic error");

    const newProduct = await super.createProduct(newElectronic._id);
    if (!newProduct) throw new BadRequestError("Create new product error");

    return newProduct;
  }
}

// Create sub-class for different product types Furniture
class Furniture extends Product {
  async createProduct() {
    const newFurniture = await FurnitureModel.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newFurniture) throw new BadRequestError("Create new electronic error");

    const newProduct = await super.createProduct(newFurniture._id);
    if (!newProduct) throw new BadRequestError("Create new product error");

    return newProduct;
  }
}

module.exports = ProductFactory;
