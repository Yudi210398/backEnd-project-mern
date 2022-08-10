import express from "express";
import { user } from "../Controller/userController.js";

const router = express.Router();

router.get("/users", user);

export default router;
