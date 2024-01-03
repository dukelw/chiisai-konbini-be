const redis = require("redis");
const { promisify } = require("util");
const { reservationInventory } = require("../models/repositories/Inventory");
const redisClient = redis.createClient();

const pexpire = promisify(redisClient.pExpire).bind(redisClient);
const setnxAsync = promisify(redisClient.setNX).bind(redisClient);

const acquireLock = async (product_id, quantity, cart_id) => {
  const key = `lock_v2023_${product_id}`;
  const retryTimes = 10;
  const expireTime = 3000;

  for (let i = 0; i < retryTimes.length; i++) {
    const result = await setnxAsync(key, expireTime);
    console.log(`result::`, result);
    if (result === 1) {
      const isReservation = await reservationInventory({
        product_id,
        quantity,
        cart_id,
      });
      if (isReservation.modifiedCount) {
        await pexpire(key, expireTime);
        return key;
      }
      return null;
    } else {
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
  }
};

const releaseLock = async (keyLock) => {
  const delAsyncKey = promisify(redisClient.del).bind(redisClient);
  return await delAsyncKey(keyLock);
};

module.exports = {
  acquireLock,
  releaseLock,
};
