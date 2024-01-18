const amqp = require("amqplib");
async function consumerOrderedMessage() {
  const connection = await amqp.connect("amqp://guest:12345@localhost");
  const channel = await connection.createChannel();

  const queueName = "ordered-messages-queue";
  await channel.assertQueue(queueName, {
    durable: true,
  });

  // Set prefetch: only allow 1 task process at a time, this helps ordered messages to be processed correctly
  channel.prefetch(1);

  channel.consume(queueName, (msg) => {
    const message = msg.content.toString();

    setTimeout(() => {
      console.log(`Processed ${message}`);
      channel.ack(msg);
    }, Math.random() * 1000);
  });
}

consumerOrderedMessage().catch((error) => console.error(error));
