const KeyTokenModel = require("../models/KeyToken");
const { Types } = require("mongoose");

class KeyTokenService {
  static createKeyToken = async ({
    userID,
    publicKey,
    privateKey,
    refreshToken,
  }) => {
    try {
      // Level 0
      // const tokens = await KeyTokenModel.create({
      //   user: userID,
      //   publicKey,
      //   privateKey,
      // });
      // return tokens ? tokens.publicKey : null;

      // Level xxx
      const filter = { user: userID },
        update = {
          publicKey,
          privateKey,
          refreshTokenUsed: [],
          refreshToken,
        },
        options = { upsert: true, new: true };

      const tokens = await KeyTokenModel.findOneAndUpdate(
        filter,
        update,
        options
      );

      return tokens ? tokens.publicKey : null;
    } catch (error) {
      return error;
    }
  };

  static findByUserID = async (userID) => {
    return await KeyTokenModel.findOne({
      user: new Types.ObjectId(userID),
    });
  };

  static removeKeyByID = async (id) => {
    return await KeyTokenModel.deleteOne({ _id: new Types.ObjectId(id) });
  };

  static findByRefreshTokenUsed = async (refreshToken) => {
    return await KeyTokenModel.findOne({
      refreshTokenUsed: refreshToken,
    }).lean();
  };

  static findByRefreshToken = async (refreshToken) => {
    return await KeyTokenModel.findOne({
      refreshToken,
    });
  };

  static deleteKeyByUserID = async (userID) => {
    return await KeyTokenModel.deleteOne({
      user: new Types.ObjectId(userID),
    });
  };
}

module.exports = KeyTokenService;
