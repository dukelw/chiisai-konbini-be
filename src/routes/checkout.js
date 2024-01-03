const express = require("express");
const router = express.Router();
const asyncHandler = require("../helpers/asyncHandler");

const CheckoutController = require("../controllers/CheckoutController");
const { authenticationV2 } = require("../auth/utils");

// Authentication
router.use(authenticationV2);
router.post("/review", asyncHandler(CheckoutController.review));

module.exports = router;
