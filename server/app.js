import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
dotenv.config();
import session from "express-session";
import MongoStore from "connect-mongo";

import userRouter from "./routes/userRouter.js";
import postRouter from "./routes/postRouter.js";
import addressRouter from "./routes/addressRouter.js";
import emailRouter from "./routes/emailRouter.js";
import proRouter from "./routes/proRotuer.js";
import conversationRouter from "./routes/conversationRouter.js";
import messageRouter from "./routes/messageRouter.js";

const app = express();

const corsOptions = {
    origin: "http://localhost:3000",
    credentials: true,
};

app.use(helmet());
app.use(cors(corsOptions));
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.SESSION_SECRET));
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        store: MongoStore.create({
            mongoUrl: process.env.DB_HOST,
        }),
    })
);

app.use("/user", userRouter);
app.use("/post", postRouter);
app.use("/address", addressRouter);
app.use("/email", emailRouter);
app.use("/pro", proRouter);
app.use("/conversation", conversationRouter);
app.use("/message", messageRouter);

app.use((err, req, res, next) => {
    console.log(err);
    const errorStatus = err.status || 500;
    const errorMessage = err.message || "뭔가 오류가 생겼습니다!";
    return res.status(errorStatus).json({
        success: false,
        status: errorStatus,
        message: errorMessage,
    });
});

export default app;
