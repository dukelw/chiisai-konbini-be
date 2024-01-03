const express = require("express");
const router = express.Router();
const asyncHandler = require("../helpers/asyncHandler");

const InventoryController = require("../controllers/InventoryController");
const { authenticationV2 } = require("../auth/utils");

// Authentication
router.use(authenticationV2);
router.post("", asyncHandler(InventoryController.addStock));

module.exports = router;
