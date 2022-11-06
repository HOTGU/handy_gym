import app from "./app.js";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";

const PORT = process.env.PORT || 5000;
const DB_HOST = process.env.DB_HOST;

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true,
    },
});

global.onlineUsers = new Map();

io.on("connection", (socket) => {
    socket.on("addUser", (userId) => {
        onlineUsers.set(userId, socket.id);
        console.log(onlineUsers);
    });
    socket.on("sendMessage", ({ senderId, receiverId, text }) => {
        const receiverUserSocket = onlineUsers.get(receiverId);
        io.to(receiverUserSocket).emit("receiveMessage", {
            senderId,
            text,
        });
    });
});

const handleConnect = () => {
    console.log("✅DB연결에 성공하였습니다.");
};

const handleListen = () => {
    console.log(`✅서버가 localhost://${PORT}에서 실행중입니다`);
};

try {
    mongoose.connect(DB_HOST, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    handleConnect();
    server.listen(PORT, handleListen);
} catch (error) {
    console.log(`❌DB연결에 실패하였습니다. 오류내용 : ${error}`);
}
