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
        let user = await userSchema.findOne({ email: value });
        if (user) throw new HttpError("email sudah terdatar", 404);
        return true;
      }),
    body("nama")
      .notEmpty()
      .isLength({ min: 3 })
      .isString()
      .withMessage("Tolong diisi"),
    body("password").isLength({ min: 5 }).withMessage("minimal 5 karaketer"),
    body("passValidasi").custom((value, { req }) => {
      console.log(value === req.body.password);
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
    body("password").isLength({ min: 5 }).withMessage("minimal 5 karaketer"),
  ],
  loginUser
);

export default router;
