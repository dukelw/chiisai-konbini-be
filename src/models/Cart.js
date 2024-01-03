const { Schema, model } = require("mongoose"); // Erase if already required

const DOCUMENT_NAME = "Cart";
const COLLECTION_NAME = "Carts";

// Declare the Schema of the Mongo model
var cartSchema = new Schema(
  {
    cart_state: {
      type: String,
      required: true,
      enum: ["active", "completed", "pending", "failed"],
      default: "active"
    },
    cart_products: {
      type: Array,
      required: true,
      default: []
    },
    /*
      [
        {
          product_id,
          shop_id,
          quantity,
          name,
          price
        }
      ]
    */
    cart_count_products: {
      type: Number,
      default: 0
    },
    cart_user_id: {
      type: Number,
      required: true
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

//Export the model
module.exports = {
  cart: model(DOCUMENT_NAME, cartSchema),
};
