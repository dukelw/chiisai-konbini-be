const express = require("express");
const router = express.Router();
const asyncHandler = require("../helpers/asyncHandler");

const NotificationController = require("../controllers/NotificationController");
const { authenticationV2 } = require("../auth/utils");

// For user who have not signin

// Authentication (Signined)
router.use(authenticationV2);
router.get("", asyncHandler(NotificationController.getNotificationByUser));

module.exports = router;
