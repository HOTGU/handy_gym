import express from "express";
import { create, get, getPro } from "../controllers/conversationController.js";
import { onlyPro, onlyUser } from "../middleware.js";

const conversationRouter = express.Router();

conversationRouter.get("/get", onlyUser, get);
conversationRouter.get("/get/is-pro", onlyUser, onlyPro, getPro);
conversationRouter.post("/create", onlyUser, onlyPro, create);

export default conversationRouter;
