const { Schema, model } = require("mongoose"); // Erase if already required

const DOCUMENT_NAME = "Product";
const COLLECTION_NAME = "Products";

// Declare the Schema of the Mongo model
var productSchema = new Schema(
  {
    product_name: {
      type: String,
      required: true,
    },
    product_thumb: {
      type: String,
      required: true,
    },
    product_description: {
      type: String,
    },
    product_price: {
      type: Number,
      required: true,
    },
    product_quantity: {
      type: Number,
      required: true,
    },
    product_type: {
      type: String,
      required: true,
      enum: ["Electronic", "Clothes", "Furniture"],
    },
    product_shop: {
      type: Schema.Types.ObjectId,
      ref: "Shop",
    },
    product_attributes: {
      type: Schema.Types.Mixed,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

var clothesSchema = new Schema(
  {
    brand: {
      type: String,
      required: true,
    },
    size: String,
    material: String,
    product_shop: { type: Schema.Types.ObjectId, ref: "Shop" },
  },
  {
    timestamps: true,
    collection: "Clothes",
  }
);

var electronicSchema = new Schema(
  {
    manufacturer: {
      type: String,
      required: true,
    },
    model: String,
    color: String,
    product_shop: { type: Schema.Types.ObjectId, ref: "Shop" },
  },
  {
    timestamps: true,
    collection: "Electronic",
  }
);

var furnitureSchema = new Schema(
  {
    manufacturer: {
      type: String,
      required: true,
    },
    model: String,
    from: String,
    product_shop: { type: Schema.Types.ObjectId, ref: "Shop" },
  },
  {
    timestamps: true,
    collection: "Furniture",
  }
);

//Export the model
module.exports = {
  product: model(DOCUMENT_NAME, productSchema),
  clothes: model("Clothes", clothesSchema),
  electronic: model("Electronic", electronicSchema),
  furniture: model("Furniture", furnitureSchema),
};
