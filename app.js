import bodyParser from "body-parser";
import express from "express";
import routerUser from "./Router/userRouter.js";
import path from "path";
import routerPlace from "./Router/placeRouter.js";
import routerError from "./Router/errorRouter.js";
const __dirname = path.resolve();
const app = express();
const port = 5000;

(async () => {
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use("/api", routerUser);
  app.use("/api", routerPlace);
  app.use(routerError);

  app.use((error, req, res, next) => {
    let pesan;
    let status;
    console.log(error.message, error.statusCode);
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

  app.listen(port, () => console.log(`konek`));
})();
