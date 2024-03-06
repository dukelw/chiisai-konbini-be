const express = require("express");
const router = express.Router();
const asyncHandler = require("../helpers/asyncHandler");

const UploadController = require("../controllers/UploadController");
const { uploadDisk } = require("../configs/multer.config");

router.post(
  "/product/thumb",
  uploadDisk.single("file"),
  asyncHandler(UploadController.uploadThumb)
);

module.exports = router;
