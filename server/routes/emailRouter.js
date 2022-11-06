import express from "express";
import { send } from "../controllers/emailController.js";

const emailRouter = express.Router();

emailRouter.post("/send", send);

export default emailRouter;
