const express = require("express");
const router = express.Router();
const asyncHandler = require("../helpers/asyncHandler");

const ProductController = require("../controllers/ProductController");
const { authenticationV2 } = require("../auth/utils");

// Authentication
router.use(authenticationV2);

router.post("/create", asyncHandler(ProductController.create));

module.exports = router;
