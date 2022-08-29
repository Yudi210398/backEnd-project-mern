import bodyParser from "body-parser";
import fs from "fs";
import express from "express";
import routerUser from "./Router/userRouter.js";
import path from "path";
import routerPlace from "./Router/placeRouter.js";
import routerError from "./Router/errorRouter.js";
import mongoose from "mongoose";
const __dirname = path.resolve();
const app = express();
const port = 5000;
const URLDATABASE = `mongodb+srv://runatyudi:kawasanrokok1998@cluster0.oaqmd.mongodb.net/mernProjectData?retryWrites=true&w=majority`;

(async () => {
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use("/uploads", express.static("uploads"));
  app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Methods",
      "OPTIONS, GET, POST, PUT, PATCH, DELETE"
    );
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
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

    if (res.headerSent) return next(error);

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

  await mongoose.connect(URLDATABASE, async (err, db) => {
    if (err) console.log(err);
    await app.listen(port, () => console.log(`konek dan konek ke database`));
    db.on("disconnect", function (errrs) {
      console.log("Error...close", errrs);
    });
  });
})();
