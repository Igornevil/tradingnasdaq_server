const express = require("express");
const mongoose = require("mongoose");
const config = require("config");
const chalk = require("chalk");
const cors = require("cors");
const path = require("path");
const routes = require("./routes");
const { AsyncLocalStorage } = require("async_hooks");
// const TelegramBot = require("node-telegram-bot-api");
// const token = "6022460412:AAHh7Tk-Dq_MGIZvbFGo_vsgx6NICiS3ZJs";

// const bot = new TelegramBot(token, { polling: true });
// const chatId = "-1001829673476";

const clients = [];

const app = require("express")();
const server = require("http").createServer(app);
// const io = require("socket.io")(server, {
//     cors: {
//         origin: "http://localhost:3000",
//         methods: ["GET", "POST"]
//     }
// });

// io.on("connection", (socket) => {
//     console.log("Connect is up", socket.id);
//     clients.push(socket);
//     socket.emit("message", "Connect to Socket");
// });

// io.on("connection", (socket) => {
//     socket.emit("request", (e) => {
//         console.log("emit");
//     }); // emit an event to the socket
//     io.emit("broadcast", (e) => {
//         console.log('io.emit("broadcast"');
//     }); // emit an event to all connected sockets
//     socket.on("reply", (d) => {
//         console.log("reply");
//     }); // listen to the event
// });

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

var whitelist = [
    "http://localhost:3000",
    "http://localhost:8080",
    "http://176.104.33.48:3000",
    "http://176.104.33.48:80",
    "http://tradingnasdaq.com",
    "http://176.104.33.48:8080",
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
// app.use("/api", routes);
app.use(cors());
// app.use(cors(corsOptions));
app.use("/api", routes);

const PORT = config.get("port") ?? 8080;

if (process.env.NODE_ENV === "production") {
    app.use("/", express.static(path.join(__dirname, "client")));
    // app.use("/phone", express.static(path.join(__dirname, "client")));
    // app.use("/notebook", express.static(path.join(__dirname, "client")));
    // app.use("/product/:id", express.static(path.join(__dirname, "client")));

    const indexPath = path.join(__dirname, "client", "index.html");
    app.get("*", (res, req) => {
        console.log("getttt");
        res.sendFile(indexPath);
    });
}

async function start() {
    try {
        // await mongoose.connect(config.get("mongoUri"));
        // console.log(chalk.green(`MongoDB connected.`));
        server.listen(PORT, () =>
            // app.listen(PORT, () =>
            console.log(
                chalk.green(`Server has been started on port ${PORT}...`)
            )
        );
    } catch (e) {
        console.log(chalk.red(e.message));
        process.exit(1);
    }
}

start();

// bot.on("message", (msg) => {
//     console.log(msg.text);
//     // console.log(clients);
//     // clients[0].emit("message", "Test");
//     // console.log(msg);
//     // clients[0].send(msg.text);
// });

// router.post("/sendMessage", async (req, res) => {
//     try {
//         const { id, text } = req.body;
//         console.log(id, text);
//         bot.sendMessage(chatId, text);
//         return res.status(200).send(text);
//     } catch (error) {
//         res.status(500).json({
//             message: "На сервере произошла ошибка. Попробуйте позже"
//         });
//     }
// });
