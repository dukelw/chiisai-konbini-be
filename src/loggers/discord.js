const { Client, GatewayIntentBits } = require("discord.js");
const client = new Client({
  intents: [
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.on("ready", () => {
  console.log(`Logger is as ${client.user.tag}`);
});

const token =
  "MTE5MTczMjU0NDM2Njk3NzA1NA.GrOlO2.4IsqGMl616IasYT0FPuAUMMVSXfHHB7svstmBY";
client.login(token);

client.on("messageCreate", (msg) => {
  if (msg.author.bot) return;
  if (msg.content === "Hello") {
    msg.reply("Hello! How can I help you today?");
  }
});
