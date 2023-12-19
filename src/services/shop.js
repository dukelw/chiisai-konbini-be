const ShopModel = require("../models/Shop");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const KeyTokenService = require("../services/keyToken");
const { createTokenPair, verifyJWT } = require("../auth/utils");
const { getInfoData } = require("../utils");
const {
  BadRequestError,
  AuthFailureError,
  ForbiddenError,
} = require("../core/errorResponse");
const { findByEmail } = require("./shopHelp");

const RoleShop = {
  SHOP: "SHOP",
  WRITER: "WRITER",
  EDITOR: "EDITOR",
  ADMIN: "ADMIN",
};

class ShopService {
  static refreshTokenV2 = async ({ refreshToken, user, keyStore }) => {
    const { userID, email } = user;

    if (keyStore.refreshTokenUsed.includes(refreshToken)) {
      // Delete all token in keyStore
      await KeyTokenService.deleteKeyByUserID(userID);
      throw new ForbiddenError("Something wrong happen! Pls relogin");
    }

    if (keyStore.refreshToken !== refreshToken)
      throw new AuthFailureError("Shop is not registered");

    // Check userID
    const foundShop = await findByEmail({ email });
    if (!foundShop) throw new AuthFailureError("Shop is not registered");

    // Create new token
    const tokens = await createTokenPair(
      { userID, email },
      keyStore.publicKey,
      keyStore.privateKey
    );

    // Update token
    await keyStore.updateOne({
      $set: {
        refreshToken: tokens.refreshToken,
      },
      $addToSet: {
        refreshTokenUsed: refreshToken,
      },
    });

    return {
      user,
      tokens,
    };
  };

  static refreshTokenV1 = async (refreshToken) => {
    // Check if the token is used
    const foundToken = await KeyTokenService.findByRefreshTokenUsed(
      refreshToken
    );

    if (foundToken) {
      // Decode to know who was the user
      const { userID, email } = await verifyJWT(
        refreshToken,
        foundToken.privateKey
      );
      console.log({ userID, email });

      // Delete all token in keyStore
      await KeyTokenService.deleteKeyByUserID(userID);
      throw new ForbiddenError("Something wrong happen! Pls relogin");
    }

    // If token is not use
    const holderToken = await KeyTokenService.findByRefreshToken(refreshToken);
    if (!holderToken) throw new AuthFailureError("Shop is not registered");

    // Verify token
    const { userID, email } = await verifyJWT(
      refreshToken,
      holderToken.privateKey
    );
    console.log("[2---]", { userID, email });

    // Check userID
    const foundShop = await findByEmail({ email });
    if (!foundShop) throw new AuthFailureError("Shop is not registered");

    // Create new token
    const tokens = await createTokenPair(
      { userID, email },
      holderToken.publicKey,
      holderToken.privateKey
    );

    // Update token
    await holderToken.updateOne({
      $set: {
        refreshToken: tokens.refreshToken,
      },
      $addToSet: {
        refreshTokenUsed: refreshToken,
      },
    });

    return {
      user: { userID, email },
      tokens,
    };
  };

  static logOut = async (keyStore) => {
    const delKey = await KeyTokenService.removeKeyByID(keyStore._id);
    console.log({ delKey });
    return delKey;
  };

  /* SignIn
    1. Check email
    2. Match password
    3. Create privateKey, publicKey and save
    4. Generate token
    5. Get data
  */

  static signIn = async ({ email, password, refreshToken = null }) => {
    // 1. Check email
    const foundShop = await findByEmail({ email });
    if (!foundShop) throw new BadRequestError("Shop is not registered");

    // 2. Match password
    const match = await bcrypt.compare(password, foundShop.password);
    if (!match) throw new AuthFailureError("Authentication error");

    // 3. Create privateKey, publicKey
    const privateKey = crypto.randomBytes(64).toString("hex");
    const publicKey = crypto.randomBytes(64).toString("hex");

    // 4. Generate token
    const { _id: userID } = foundShop;
    const tokens = await createTokenPair(
      { userID, email },
      publicKey,
      privateKey
    );

    await KeyTokenService.createKeyToken({
      userID,
      refreshToken: tokens.refreshToken,
      privateKey,
      publicKey,
    });

    // 5. Get data
    return {
      shop: getInfoData({
        fields: ["_id", "name", "email"],
        object: foundShop,
      }),
      tokens,
    };
  };

  static signUp = async ({ name, email, password }) => {
    // Step 1: Check the existence of email
    const holderShop = await ShopModel.findOne({ email }).lean();
    if (holderShop)
      throw new BadRequestError("Error: Shop is already registered");

    const hashedPassword = await bcrypt.hash(password, 10);
    const newShop = await ShopModel.create({
      name,
      email,
      password: hashedPassword,
      roles: [RoleShop.SHOP],
    });

    if (newShop) {
      // Create privateKey, publicKey
      const privateKey = crypto.randomBytes(64).toString("hex");
      const publicKey = crypto.randomBytes(64).toString("hex");

      console.log({ privateKey, publicKey });

      const keyStore = await KeyTokenService.createKeyToken({
        userID: newShop._id,
        publicKey,
        privateKey,
      });

      if (!keyStore) {
        return {
          code: "xxx",
          message: "keyStore error",
        };
      }

      // Create token pair
      const tokens = await createTokenPair(
        { userID: newShop._id, email },
        publicKey,
        privateKey
      );
      console.log("Created Token Success::", tokens);

      return {
        code: 201,
        metadata: {
          shop: getInfoData({
            fields: ["_id", "name", "email"],
            object: newShop,
          }),
          tokens,
        },
      };
    }
    return {
      code: 200,
      metadata: null,
    };
  };
}

module.exports = ShopService;
