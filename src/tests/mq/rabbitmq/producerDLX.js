const amqp = require("amqplib");
const messages = "Hello, RabbitMQ for Lewis!";

const log = console.log;
console.log = function () {
  log.apply(console, [new Date()].concat(arguments));
};

const runProducer = async () => {
  try {
    const connection = await amqp.connect("amqp://guest:12345@localhost");
    const channel = await connection.createChannel();

    const notificationExchange = "notificationEx"; // notificationEx direct
    const notificationQueue = "notificationQueueProcess"; // assertQueue
    const notificationExchangeDLX = "notificationExDLX"; // notificationEx DLX
    const notificationRoutingKeyLDX = "notificationRoutingKeyDLX"; // assert

    // 1. Create exchange
    await channel.assertExchange(notificationExchange, "direct", {
      durable: true,
    });

    // 2. Create queue
    const queueResult = await channel.assertQueue(notificationQueue, {
      exclusive: false,
      deadLetterExchange: notificationExchangeDLX,
      deadLetterRoutingKey: notificationRoutingKeyLDX,
    });

    // 3. Bind queue
    await channel.bindQueue(queueResult.queue, notificationExchange);

    // 4. Send message
    const msg = "A new product";
    console.log(`Producer msg:: ${msg}`);
    await channel.sendToQueue(queueResult.queue, Buffer.from(msg), {
      expiration: "10000",
    });

    setTimeout(() => {
      connection.close();
      process.exit(0);
    }, 500);
  } catch (error) {
    console.error(error);
  }
};

runProducer().catch(console.error);
