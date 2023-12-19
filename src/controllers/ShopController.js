const ShopService = require("../services/shop");
const { OK, CREATED, SuccessResponse } = require("../core/successResponse");

class ShopController {
  async refreshToken(req, res, next) {
    // AuthenticationV1
    // new SuccessResponse({
    //   message: "Refresh token success",
    //   metadata: await ShopService.refreshTokenV1(req.body.refreshToken),
    // }).send(res);

    // AuthenticationV2
    new SuccessResponse({
      message: "Refresh token success",
      metadata: await ShopService.refreshTokenV2({
        refreshToken: req.refreshToken,
        user: req.user,
        keyStore: req.keyStore,
      }),
    }).send(res);
  }

  async logout(req, res, next) {
    new SuccessResponse({
      message: "Logout success",
      metadata: await ShopService.logOut(req.keyStore),
    }).send(res);
  }

  async signin(req, res, next) {
    new SuccessResponse({
      metadata: await ShopService.signIn(req.body),
    }).send(res);
  }

  async signup(req, res, next) {
    console.log(req.body);
    new CREATED({
      message: "Registered OK!",
      metadata: await ShopService.signUp(req.body),
      options: {
        limit: 10,
      },
    }).send(res);
  }
}

module.exports = new ShopController();
