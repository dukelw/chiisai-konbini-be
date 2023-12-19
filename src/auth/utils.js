const JWT = require("jsonwebtoken");
const asyncHandler = require("../helpers/asyncHandler");
const { AuthFailureError, NotFoundError } = require("../core/errorResponse");
const { findByUserID } = require("../services/keyToken");

const HEADER = {
  API_KEY: "x-api-key",
  CLIENT_ID: "x-client-id",
  AUTHORIZATION: "authorization",
  REFRESHTOKEN: "x-rtoken-id",
};

const createTokenPair = async (payload, publicKey, privateKey) => {
  try {
    const accessToken = await JWT.sign(payload, publicKey, {
      expiresIn: "2 days",
    });

    const refreshToken = await JWT.sign(payload, privateKey, {
      expiresIn: "7 days",
    });

    JWT.verify(accessToken, publicKey, (err, decode) => {
      if (err) {
        console.error("Error verify::", err);
      } else {
        console.log("Decode verify::", decode);
      }
    });
    return { accessToken, refreshToken };
  } catch (error) {}
};

const authenticationV1 = asyncHandler(async (req, res, next) => {
  /*
    1. Check userID missing
    2. Get access token
    3. Verify token
    4. Check user in database
    5. Check keyStore with userID
    6. Return next
  */

  // 1. Check userID missing
  const userID = req.headers[HEADER.CLIENT_ID];
  if (!userID) throw new AuthFailureError("Invalid request");

  // 2. Get access token
  const keyStore = await findByUserID(userID);
  if (!keyStore) throw new NotFoundError("Not found keyStore");

  // 3. Verify token
  const accessToken = req.headers[HEADER.AUTHORIZATION];
  if (!accessToken) throw new AuthFailureError("Invalid request");

  try {
    const decodeUser = JWT.verify(accessToken, keyStore.publicKey);
    if (userID !== decodeUser.userID)
      throw new AuthFailureError("Invalid userID");
    req.keyStore = keyStore;
    return next();
  } catch (error) {
    throw error;
  }
});

const authenticationV2 = asyncHandler(async (req, res, next) => {
  /*
    1. Check userID missing
    2. Get access token
    3. Verify token
    4. Check user in database
    5. Check keyStore with userID
    6. Return next
  */

  // 1. Check userID missing
  const userID = req.headers[HEADER.CLIENT_ID];
  if (!userID) throw new AuthFailureError("Invalid request");

  // 2. Get access token
  const keyStore = await findByUserID(userID);
  if (!keyStore) throw new NotFoundError("Not found keyStore");

  // 3. Verify token
  if (req.headers[HEADER.REFRESHTOKEN]) {
    try {
      const refreshToken = req.headers[HEADER.REFRESHTOKEN];
      const decodeUser = JWT.verify(refreshToken, keyStore.privateKey);
      if (userID !== decodeUser.userID)
        throw new AuthFailureError("Invalid userID");
      req.keyStore = keyStore;
      req.user = decodeUser;
      req.refreshToken = refreshToken;
      return next();
    } catch (error) {
      throw error;
    }
  }

  const accessToken = req.headers[HEADER.AUTHORIZATION];
  if (!accessToken) throw new AuthFailureError("Invalid request");

  try {
    const decodeUser = JWT.verify(accessToken, keyStore.publicKey);
    if (userID !== decodeUser.userID)
      throw new AuthFailureError("Invalid userID");
    req.keyStore = keyStore;
    req.user = decodeUser;
    return next();
  } catch (error) {
    throw error;
  }
});

const verifyJWT = async (token, keySecret) => {
  return await JWT.verify(token, keySecret);
};

module.exports = {
  createTokenPair,
  authenticationV1,
  authenticationV2,
  verifyJWT,
};
