import express from "express";
import { get, getMe, register, update } from "../controllers/proController.js";
import { onlyPro, onlyUser, proPhotosMulter } from "../middleware.js";

const proRouter = express.Router();

proRouter.get("/me", onlyUser, getMe);
proRouter.get("/get/:id", get);
proRouter.post("/register", onlyUser, proPhotosMulter, register);
proRouter.post("/update", onlyUser, onlyPro, proPhotosMulter, update);

export default proRouter;
