import express from "express";
import { error } from "../Controller/error.js";

const routerError = express.Router();
routerError.use(error);

export default routerError;
