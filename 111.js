const TelegramBot = require("node-telegram-bot-api");
const token = "6022460412:AAHh7Tk-Dq_MGIZvbFGo_vsgx6NICiS3ZJs";

const bot = new TelegramBot(token, { polling: true });

bot.on("message", (msg) => {
    //anything
});

// console.log(bot);

bot.on("message", (msg) => {
    var Hi = "/hi";
    if (msg.text.toString().toLowerCase().indexOf(Hi) === 0) {
        bot.sendMessage(msg.chat.id, "Hello dear user");
    }
});

bot.on("message", (msg) => {
    var Hi = "/start";
    if (msg.text.toString().toLowerCase().indexOf(Hi) === 0) {
        console.log(msg);
        bot.sendMessage(msg.chat.id, msg.chat.id);
    }
});

// bot.getChat();
