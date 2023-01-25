import bodyParser from "body-parser";
import fs from "fs";
import express from "express";
import routerUser from "./Router/userRouter.js";
import path from "path";
import routerPlace from "./Router/placeRouter.js";
import routerError from "./Router/errorRouter.js";
import mongoose from "mongoose";
import * as dotenv from "dotenv";
dotenv.config();
const port = process.env.PORT;

const __dirname = path.resolve();
const app = express();

mongoose.set("strictQuery", false);
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
(async () => {
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use("/uploads", express.static("uploads"));
  app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Methods",
      "OPTIONS, GET, POST, PUT, PATCH, DELETE",
    );
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization",
    );
    next();
  });

  app.use("/api", routerUser);
  app.use("/api", routerPlace);
  app.use(routerError);

  app.use((error, req, res, next) => {
    let pesan;
    let status;

    if (req.file) fs.unlink(req.file.path, (err) => console.log(err));

    if (error.statusCode === 500) {
      status = error.statusCode;
      pesan = "Server Bermasalah";
      return res
        .status(status)
        .json({ error: { pesan: `${error.message + " " + status}` } });
    }
    status = error.statusCode;
    pesan = error.message;
    res.status(status).json({ error: { pesan: `${pesan + " " + status}` } });
  });

  connectDB().then(() => {
    app.listen(port, () => {
      console.log("listening for requests", `konek`);
    });
  });
})();
