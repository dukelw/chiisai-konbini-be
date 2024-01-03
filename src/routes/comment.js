const express = require("express");
const router = express.Router();
const asyncHandler = require("../helpers/asyncHandler");

const CommentController = require("../controllers/CommentController");
const { authenticationV2 } = require("../auth/utils");

// Authentication
router.use(authenticationV2);
router.post("", asyncHandler(CommentController.create));
router.get("", asyncHandler(CommentController.getCommentByParentID));
router.delete("", asyncHandler(CommentController.delete));

module.exports = router;
