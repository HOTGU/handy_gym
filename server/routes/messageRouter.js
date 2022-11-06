import express from "express";
import { get } from "../controllers/messageController.js";
import { add } from "../controllers/messageController.js";
import {} from "../controllers/messageController.js";
import { onlyUser } from "../middleware.js";

const messageRouter = express.Router();

messageRouter.post("/add", onlyUser, add);
messageRouter.get("/:conversationId", onlyUser, get);

export default messageRouter;
