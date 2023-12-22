/*
  Discount Services
  1 - Generate discount code [Shop | Admin]
  2 - Get discount amount [User]
  3 - Get all discount code [User | Shop]
  4 - Verify discount code [User]
  5 - Delete discount code [Shop | Admin]
  6 - Cancel discount code [User]
*/

const { BadRequestError, NotFoundError } = require("../core/errorResponse");
const { discount: DiscountModel } = require("../models/Discount");
const {
  updateDiscountByCode,
  findAllDiscountCodesUnselect,
  checkDiscountExistence,
} = require("../models/repositories/Discount");
const { convertToObjectIDMongo } = require("../utils/index");
const { updateNestedObjectParser } = require("../utils/index");
const { findAllProducts } = require("../models/repositories/Product");

class DiscountService {
  static async createDiscountCode(payload) {
    const {
      code,
      start_day,
      end_day,
      is_active,
      shop_id,
      min_order_value,
      product_ids,
      applies_to,
      name,
      description,
      type,
      value,
      max_value,
      users_uses,
      max_uses,
      uses_count,
      max_uses_per_user,
    } = payload;

    // Check
    if (new Date() > new Date(end_day)) {
      throw new BadRequestError("Discount code has expried!");
    }

    if (new Date(start_day) > new Date(end_day))
      throw new BadRequestError("Start day must before end day");

    // Create index for discount code
    const foundDiscount = await DiscountModel.findOne({
      discount_code: code,
      discount_shop_id: convertToObjectIDMongo(shop_id),
    }).lean();

    if (foundDiscount && foundDiscount.discount_is_active)
      throw new BadRequestError("Discount existed!");

    const newDiscount = await DiscountModel.create({
      discount_name: name,
      discount_description: description,
      discount_type: type,
      discount_value: value,
      discount_max_value: max_value,
      discount_code: code,
      discount_start_date: new Date(start_day),
      discount_end_date: new Date(end_day),
      discount_max_uses: max_uses,
      discount_uses_count: uses_count,
      discount_users_used: users_uses,
      discount_max_uses_per_user: max_uses_per_user,
      discount_min_order_value: min_order_value || 0,
      discount_shop_id: convertToObjectIDMongo(shop_id),
      discount_is_active: is_active,
      discount_applies_to: applies_to === "all" ? "all" : "specific",
      discount_product_ids: product_ids,
    });
    return newDiscount;
  }

  static async updateDiscountCode(discount_shop_id, discount_code, bodyUpdate) {
    const newBodyUpdate = updateNestedObjectParser(bodyUpdate);
    return await updateDiscountByCode({
      discount_shop_id,
      discount_code,
      bodyUpdate: newBodyUpdate,
    });
  }

  // Get all discount codes available for products
  static async getAllDiscountCodesWithProduct({
    code,
    shop_id,
    user_id,
    limit,
    page,
  }) {
    // Create index for discount code
    const foundDiscount = await checkDiscountExistence({
      Model: DiscountModel,
      filter: {
        discount_code: code,
        discount_shop_id: convertToObjectIDMongo(shop_id),
      },
    });

    if (!foundDiscount || !foundDiscount.discount_is_active)
      throw new NotFoundError("Discount doesn't existed!");

    const { discount_applies_to, discount_product_ids } = foundDiscount;
    let products;
    if (discount_applies_to === "all") {
      products = await findAllProducts({
        filter: {
          product_shop: convertToObjectIDMongo(shop_id),
          isPublished: true,
        },
        limit: +limit,
        page: +page,
        sort: "ctime",
        select: ["product_name"],
      });
    } else if (discount_applies_to === "specific") {
      products = await findAllProducts({
        filter: {
          _id: { $in: discount_product_ids },
          isPublished: true,
        },
        limit: +limit,
        page: +page,
        sort: "ctime",
        select: ["product_name"],
      });
    }
    return products;
  }

  // Get all discount code of a shop
  static async getAllDiscountCodesOfShop({ limit, page, shop_id }) {
    const discounts = await findAllDiscountCodesUnselect({
      limit: +limit,
      page: +page,
      filter: {
        discount_shop_id: convertToObjectIDMongo(shop_id),
        discount_is_active: true,
      },
      unSelect: ["__v", "discount_shop_id"],
      Model: DiscountModel,
    });
    return discounts;
  }

  /*
    Apply discount code
    products = [
      {
        productID,
        shopID,
        quantity,
        name,
        price
      },
      {
        productID,
        shopID,
        quantity,
        name,
        price
      }
    ]
  */

  static async getDiscountAmount({ code, user_id, shop_id, products }) {
    const foundDiscount = await checkDiscountExistence({
      Model: DiscountModel,
      filter: {
        discount_code: code,
        discount_shop_id: convertToObjectIDMongo(shop_id),
      },
    });

    if (!foundDiscount) throw new NotFoundError("Discount does not exist");

    const {
      discount_is_active,
      discount_max_uses,
      discount_min_order_value,
      discount_users_used,
      discount_type,
      discount_value,
      discount_end_date,
      discount_max_uses_per_user,
    } = foundDiscount;

    if (!discount_is_active) throw new NotFoundError("Discount is expried");
    if (!discount_max_uses) throw new NotFoundError("Discount are out");
    if (new Date() > new Date(discount_end_date))
      throw new NotFoundError("Discount are out");

    // Check min order value
    let totalOrder = 0;
    if (discount_min_order_value > 0) {
      // Get total
      totalOrder = products.reduce((acc, product) => {
        return acc + product.quantity * product.price;
      }, 0);

      if (totalOrder < discount_min_order_value)
        throw new NotFoundError(
          `Discount require minimum order value ${discount_min_order_value}`
        );
    }

    if (discount_max_uses_per_user > 0) {
      console.log("User check");
      const usedUserDiscount = discount_users_used.find(
        (user) => user.user_id === user_id
      );

      if (usedUserDiscount)
        throw new NotFoundError("Each user can use this code once");
    }

    // Check if discount is fixed_amount
    const amount =
      discount_type === "fixed_amount"
        ? discount_value
        : totalOrder * (discount_value / 100);

    return {
      totalOrder,
      discount: amount,
      totalPrice: totalOrder - amount,
    };
  }

  static async deleteDiscountCode({ shop_id, code }) {
    const deleted = await DiscountModel.findOneAndDelete({
      discount_code: code,
      discount_shop_id: shop_id,
    });

    return deleted;
  }

  static async cancelDiscountCode({ code, shop_id, user_id }) {
    const foundDiscount = checkDiscountExistence({
      Model: DiscountModel,
      filter: {
        discount_code: code,
        discount_shop_id: convertToObjectIDMongo(shop_id),
      },
    });

    if (!foundDiscount) throw new NotFoundError("Discount does not exist");

    const result = await DiscountModel.findByIdAndUpdate(foundDiscount._id, {
      $pull: {
        discount_users_used: user_id,
      },
      $inc: {
        discount_max_uses: 1,
        discount_uses_count: -1,
      },
    });

    return result;
  }
}

module.exports = DiscountService;
