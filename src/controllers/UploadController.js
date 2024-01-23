const UploadService = require("../services/upload");
const { SuccessResponse } = require("../core/successResponse");
const { BadRequestError } = require("../core/errorResponse");

class UploadController {
  async upload(req, res, next) {
    new SuccessResponse({
      message: "Upload image success",
      metadata: await UploadService.uploadImageFromUrl(),
    }).send(res);
  }

  async uploadThumb(req, res, next) {
    console.log(req);
    const { file } = req;
    if (!file) throw new BadRequestError("File missing");
    new SuccessResponse({
      message: "Upload thumbnail image success",
      metadata: await UploadService.uploadImageFromLocal({
        path: file.path,
      }),
    }).send(res);
  }
}

module.exports = new UploadController();
