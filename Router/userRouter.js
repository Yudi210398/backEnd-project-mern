import express from "express";
import { daftarUser, loginUser, user } from "../Controller/userController.js";
import { body } from "express-validator";
import HttpError from "../model/Http-Error.js";
const router = express.Router();
import userSchema from "../model/dataReal/userdata.js";
import bcrypt from "bcrypt";
let users;

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
    body("gambar")
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
        users = await userSchema.findOne({ email: value });
        if (!users)
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
        await bcrypt.compare(value, users.password, (err, result) => {
          try {
            console.log(err, users.password, result);
            if (result === false)
              throw new HttpError(
                "passsword tidak ditemukan, coba lagi, atau daftar akun",
                404
              );
          } catch (err) {
            throw err;
          }
        });
      }),
  ],
  loginUser
);

export default router;
