const amqp = require("amqplib");
const messages = "Hello, RabbitMQ for Lewis!";

const runProducer = async () => {
  try {
    const connection = await amqp.connect("amqp://guest:12345@localhost");
    const channel = await connection.createChannel();

    const queueName = "test-topic";
    await channel.assertQueue(queueName, {
      durable: true,
    });

    // Send message to consumer channel
    channel.sendToQueue(queueName, Buffer.from(messages));
    console.log(`Message send: `, messages);
  } catch (error) {
    console.error(error);
  }
};

runProducer().catch(console.error);
