import express from "express";
import { daftarUser, loginUser, user } from "../Controller/userController.js";
import { body } from "express-validator";
import dataUser from "../model/dummyData/userData/data.js";
import HttpError from "../model/Http-Error.js";
const router = express.Router();

const dataFilterData = (dataUser, value) =>
  dataUser.filter((data) => data.email === value);

router.get("/users", user);
router.post(
  "/users/daftar",
  [
    body("email")
      .isEmail()
      .normalizeEmail()
      .withMessage("tolong masukan email dengan benar")
      .toLowerCase()
      .trim()
      .custom(async (value, { req }) => {
        let user = dataFilterData(dataUser, value);
        if (user.length > 0) throw new HttpError("email sudah terdatar", 404);
        return true;
      }),
    body("nama")
      .notEmpty()
      .isLength({ min: 3 })
      .isString()
      .withMessage("Tolong diisi"),
    body("password").isLength({ min: 5 }).withMessage("minimal 5 karaketer"),
    body("passValidasi").custom((value, { req }) => {
      if (value !== req.body.password)
        throw new HttpError("password harus sama", 401);
      return true;
    }),
  ],
  daftarUser
);

router.post(
  "/users/login",
  [
    body("email")
      .isEmail()
      .normalizeEmail()
      .withMessage('"tolong masukan email dengan benar"')
      .toLowerCase()
      .trim()
      .custom(async (value, { req }) => {
        let user = dataFilterData(dataUser, value);
        if (user.length === 0)
          throw new HttpError(
            "Email tidak ditemukan, coba lagi, atau daftar akun",
            404
          );
        return true;
      }),
    body("password")
      .isLength({ min: 5 })
      .withMessage("minimal 5 karaketer")
      .custom(async (value, { req }) => {
        const dataIndekds = dataUser.findIndex(
          (data) => data.email === req.body.email
        );

        if (dataUser[dataIndekds].password === value) return true;
        else throw new HttpError("Password Tidak Sama", 401);
      }),
  ],
  loginUser
);

export default router;
