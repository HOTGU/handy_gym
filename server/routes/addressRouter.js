import express from "express";

import { search } from "../controllers/addressController.js";

const addressRouter = express.Router();

addressRouter.get("/search", search);

export default addressRouter;
