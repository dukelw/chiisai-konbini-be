const express = require("express");
const router = express.Router();
const asyncHandler = require("../helpers/asyncHandler");

const DiscountController = require("../controllers/DiscountController");
const { authenticationV2 } = require("../auth/utils");

router.get(
  "/codes/applyfor",
  asyncHandler(DiscountController.getAllDiscountCodesWithProduct)
);
router.post("/amount", asyncHandler(DiscountController.getDiscountAmount));

// Authentication
router.use(authenticationV2);

router.post("/create", asyncHandler(DiscountController.create));
router.get(
  "/codes/all",
  asyncHandler(DiscountController.getAllDiscountCodesOfShop)
);
router.delete(
  "/delete/:code",
  asyncHandler(DiscountController.deleteDiscountCode)
);
router.post(
  "/cancel/:shop_id",
  asyncHandler(DiscountController.cancelDiscountCode)
);
router.patch("/update/:discount_code", asyncHandler(DiscountController.update));

// Query

module.exports = router;
