const NotificationService = require("../services/notification");
const { SuccessResponse } = require("../core/successResponse");

class NotificationController {
  // Get list notification by user
  async getNotificationByUser(req, res, next) {
    new SuccessResponse({
      message: "Get notification by user success",
      metadata: await NotificationService.listNotificationByUser(req.body),
    }).send(res);
  }
}

module.exports = new NotificationController();
