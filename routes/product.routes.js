const express = require("express");
const Product = require("../models/Product");
const Category = require("../models/Category");
const router = express.Router({ mergeParams: true });
const { generateDefaultImg } = require("../utils/helpers");
const TelegramBot = require("node-telegram-bot-api");
const token = "6022460412:AAHh7Tk-Dq_MGIZvbFGo_vsgx6NICiS3ZJs";
// const WebSocket = require("ws");
// const { WebSocketServer } = require("ws");

const bot = new TelegramBot(token, { polling: true });
const chatId = "-1001829673476";
let clients = [];
let clientsIds = [];
let count = 0;

var whitelist = [
    "http://localhost:3000",
    "http://localhost:8080",
    "http://176.104.33.48:3000",
    "http://tradingnasdaq.com",
    "http://176.104.33.48:8080",
    "http://176.104.33.48:80",
    "ws://176.104.33.48:3000",
    "https://176.104.33.48:3000"
];
var corsOptions = {
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    }
};
// origin: "http://localhost:3000",

const io = require("socket.io")("8081", {
    cors: {
        origin: corsOptions,
        methods: ["GET", "POST"]
    }
});

function helloMessage(socket) {
    const firstMessage = setTimeout(() => {
        const sendMessage = {
            id: Date.now(),
            text: "Добрый день! Я Игорь - консультант по сайту. Чем я могу Вам помочь?",
            // author: msg.from.first_name,
            author: "Администратор",
            isSendMe: true
        };
        socket.emit("hello", sendMessage);
    }, 5000);
}

io.on("connection", (socket) => {
    helloMessage(socket);
    console.log("Connect is up", socket.id);
    count++;
    socket.username = "User_" + count;
    socket.emit("reg_username", socket.username);

    clients.push(socket);
    // socket.emit("message", "Connect to Socket");
    socket.on("sendMessage", async (e) => {
        console.log("message", e);

        const messageUser =
            "<i>" + socket.username + "</i> : " + "<code>" + e + "</code>";

        const mes = await bot.sendMessage(chatId, messageUser, {
            reply_to_message_id: socket.lastMessageId
                ? socket.lastMessageId
                : null,
            allow_sending_without_reply: true,
            parse_mode: "HTML"
        });

        const temp = {
            msgId: mes.message_id,
            socketId: socket.id
        };
        clientsIds.push(temp);
    });

    socket.on("reg_id", async (e) => {
        socket._id = e;
    });
    socket.on("reg_username", async (e) => {
        socket.username = e;
    });

    socket.on("disconnect", (reason) => {
        console.log("Пользователь отключился", socket.id);
        const newClientsIds = clientsIds.filter(
            (el) => el.socketId !== socket.id
        );
        clientsIds = newClientsIds;

        const newClients = clients.filter((el) => el.id !== socket.id);
        clients = newClients;
        // console.log("clients = ", clients);
        // console.log("clientsIds = ", clientsIds);
    });
});

bot.on("message", (msg) => {
    const elem = clientsIds.find((el) => el.msgId === msg.message_thread_id);

    const currentSocket = clients.find((el) => el.id === elem.socketId);

    currentSocket.lastMessageId = msg.message_id;
    // console.log(msg);
    const sendMessage = {
        id: Date.now(),
        text: msg.text,
        // author: msg.from.first_name,
        author: "Администратор",
        isSendMe: true
    };
    currentSocket.emit("message", sendMessage);
});

router.get("/", async (req, res) => {
    const { cat } = req.query;

    try {
        if (cat) {
            const categoryId = await Category.findOne({ name: cat });
            const list = await Product.find({ category: categoryId._id });
            return res.status(200).send(list);
        }
        const list = await Product.find();
        res.status(200).send(list);
    } catch (e) {
        res.status(500).json({
            message: "На сервере произошла ошибка. Попробуйте позже 404"
        });
    }
});
router.post("/sendMessage", async (req, res) => {
    try {
        const { id, text } = req.body;
        // console.log(id, text);

        // bot.sendMessage(chatId, text);
        // bot.sendMessage(chatId, text);

        return res.status(200).send(text);
    } catch (error) {
        res.status(500).json({
            message: "На сервере произошла ошибка. Попробуйте позже"
        });
    }

    // try {
    //     const isFound = await Product.findOne({ name });

    //     if (isFound) {
    //         return res.status(400).send({
    //             error: {
    //                 message: "PRODUCT_EXISTS",
    //                 code: 400
    //             }
    //         });
    //     }

    //     const content = await Product.create({
    //         ...generateDefaultImg(),
    //         ...req.body
    //     });

    //     return res.status(200).send(content);
    // } catch (e) {
    //     res.status(500).json({
    //         message: "На сервере произошла ошибка. Попробуйте позже"
    //     });
    // }
});
router.get("/?query", async (req, res) => {
    try {
        const { query } = req.params;
        console.log(query);
        return res.status(200).send({
            message: query
        });
    } catch (e) {
        console.log(e);
        res.status(500).json({
            message: "На сервере произошла ошибка. Попробуйте позже1"
        });
    }
});
router.get("/:productId", async (req, res) => {
    try {
        const { productId } = req.params;
        const findProduct = await Product.findById(productId);

        if (!findProduct) {
            return res.status(400).json({ message: "Product not found" });
        }
        return res.status(200).send(findProduct);
    } catch (e) {
        res.status(500).json({
            message: "На сервере произошла ошибка. Попробуйте позже2"
        });
    }
});

module.exports = router;
