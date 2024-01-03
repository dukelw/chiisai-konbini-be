const express = require("express");
const router = express.Router();
const asyncHandler = require("../helpers/asyncHandler");

const CartController = require("../controllers/CartController");
const { authenticationV2 } = require("../auth/utils");

// Authentication
router.use(authenticationV2);
router.post("/update", asyncHandler(CartController.update));
router.post("", asyncHandler(CartController.create));
router.get("", asyncHandler(CartController.listToCart));
router.delete("", asyncHandler(CartController.delete));

module.exports = router;
