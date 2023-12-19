const express = require("express");
const router = express.Router();
const asyncHandler = require("../helpers/asyncHandler");

const ShopController = require("../controllers/ShopController");
const { authenticationV1, authenticationV2 } = require("../auth/utils");

router.post("/signup", asyncHandler(ShopController.signup));
router.post("/signin", asyncHandler(ShopController.signin));

// Authentication
router.use(authenticationV2);

// Paths which needs to signin to use is placed below the authentication
router.post("/logout", asyncHandler(ShopController.logout));
router.post("/refresh-token", asyncHandler(ShopController.refreshToken));

module.exports = router;
