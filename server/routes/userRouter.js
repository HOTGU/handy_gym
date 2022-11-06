import express from "express";
import {
    refresh,
    signin,
    signup,
    logout,
    update,
    mePosts,
    getUser,
} from "../controllers/userController.js";
import { onlyUser, userAvatarMulter } from "../middleware.js";

const userRouter = express.Router();

userRouter.post("/signup", signup);
userRouter.post("/signin", signin);
userRouter.post("/refresh", refresh);
userRouter.post("/logout", onlyUser, logout);
userRouter.get("/me/posts", onlyUser, mePosts);
userRouter.get("/:id", onlyUser, getUser);
userRouter.post("/update", onlyUser, userAvatarMulter, update);

export default userRouter;
