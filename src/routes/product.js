const express = require("express");
const router = express.Router();
const asyncHandler = require("../helpers/asyncHandler");

const ProductController = require("../controllers/ProductController");
const { authenticationV2 } = require("../auth/utils");

router.get(
  "/search/:keySearch",
  asyncHandler(ProductController.getListSearchProduct)
);
router.get("", asyncHandler(ProductController.findAllProducts));
// The variable_name after : decide req.params.variable_name. If :id then when using, we use req.params.id, in this case we use req.params.product_id
router.get("/:product_id", asyncHandler(ProductController.findProduct));

// Authentication
router.use(authenticationV2);

router.post("/create", asyncHandler(ProductController.create));
router.patch("/update/:product_id", asyncHandler(ProductController.update));
router.post(
  "/publish/:id",
  asyncHandler(ProductController.publishProductByShop)
);
router.post(
  "/unpublish/:id",
  asyncHandler(ProductController.unPublishProductByShop)
);

// Query
router.get("/drafts/all", asyncHandler(ProductController.getAllDraftsForShop));
router.get(
  "/publish/all",
  asyncHandler(ProductController.getAllPublishForShop)
);

module.exports = router;
