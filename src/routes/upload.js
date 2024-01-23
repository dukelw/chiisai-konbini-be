const express = require("express");
const router = express.Router();
const asyncHandler = require("../helpers/asyncHandler");

const UploadController = require("../controllers/UploadController");
const { authenticationV2 } = require("../auth/utils");
const { uploadDisk } = require("../configs/multer.config");

// Authentication
// router.use(authenticationV2);
router.post(
  "/product/thumb",
  uploadDisk.single("file"),
  asyncHandler(UploadController.uploadThumb)
);

module.exports = router;
