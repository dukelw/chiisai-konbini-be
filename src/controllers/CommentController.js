const CommentService = require("../services/comment");
const { SuccessResponse } = require("../core/successResponse");

class CommentController {
  // Create
  async create(req, res, next) {
    new SuccessResponse({
      message: "Create new comment success",
      metadata: await CommentService.createComment({ ...req.body }),
    }).send(res);
  }

  // Get comment by parent id
  async getCommentByParentID(req, res, next) {
    new SuccessResponse({
      message: "Get comment by parent id success",
      metadata: await CommentService.getCommentByParentID(req.query),
    }).send(res);
  }

  // Get comment by parent id
  async delete(req, res, next) {
    new SuccessResponse({
      message: "Delete comment success",
      metadata: await CommentService.deleteComment(req.body),
    }).send(res);
  }
}

module.exports = new CommentController();
