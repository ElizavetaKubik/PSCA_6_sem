const TeleBot = require("node-telegram-bot-api");
const Token = "1860972689:AAGRmjFoxpau5cjcfUMPS_5k1rckBqPTtA0";

const bot = new TeleBot(Token, { polling: true });

bot.on("message", (msg) => {
  const chatId = msg.chat.id;
  console.log(msg);
  bot.sendMessage(chatId, `echo: ${msg.text}`);
});
