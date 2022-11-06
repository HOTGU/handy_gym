import express from "express";
import {
    create,
    fetch,
    getById,
    remove,
    search,
    update,
} from "../controllers/postController.js";
import { onlyUser } from "../middleware.js";

const postRouter = express.Router();

postRouter.get("/fetch", onlyUser, fetch);
postRouter.get("/search", onlyUser, search);
postRouter.get("/:id", onlyUser, getById);
postRouter.get("/:id/delete", onlyUser, remove);
postRouter.post("/:id/update", onlyUser, update);
postRouter.post("/create", onlyUser, create);

export default postRouter;
