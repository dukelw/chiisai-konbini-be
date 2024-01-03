const util = require("util");
const redis = require("redis");

class RedisPubSubService {
  constructor() {
    this.subscriber = redis.createClient({
      legacyMode: true,
    });
    this.subscriber
      .connect()
      .then(() => {
        console.log("Connect");
      })
      .catch(console.error);
    this.publisher = redis.createClient({
      legacyMode: true,
    });
    this.publisher
      .connect()
      .then(() => {
        console.log("Connect");
      })
      .catch(console.error);
  }

  async publish(channel, message) {
    const publishAsync = util
      .promisify(this.publisher.publish)
      .bind(this.publisher);

    try {
      const reply = await publishAsync(channel, message);
      return reply;
    } catch (err) {
      throw err;
    }
  }

  subscribe(channel, callback) {
    this.subscriber.subscribe(channel);
    this.subscriber.on("message", (subscriberChannel, message) => {
      if (channel === subscriberChannel) {
        callback(channel, message);
      }
    });
  }
}

module.exports = new RedisPubSubService();
