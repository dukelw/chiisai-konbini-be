const amqp = require("amqplib");
async function consumerOrderedMessage() {
  const connection = await amqp.connect("amqp://guest:12345@localhost");
  const channel = await connection.createChannel();

  const queueName = "ordered-messages-queue";
  await channel.assertQueue(queueName, {
    durable: true,
  });

  for (let i = 0; i < 10; i++) {
    const message = `ordered-queue-message::${i}`;
    console.log(`Received message: ${message}`);
    channel.sendToQueue(queueName, Buffer.from(message), {
      persistent: true,
    });
  }

  setTimeout(() => {
    connection.close();
  }, 1000);
}

consumerOrderedMessage().catch((error) => console.error(error));
