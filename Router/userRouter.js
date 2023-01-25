import express from "express";
import { daftarUser, loginUser, user } from "../Controller/userController.js";
import { body } from "express-validator";
import HttpError from "../model/http-error.js";
const router = express.Router();
import userSchema from "../model/dataReal/userdata.js";
import multer from "multer";
import { v4 } from "uuid";
import { jsonVerify } from "../middleware/json-verify.js";
let users;

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};

const simpanFile = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, `${v4()}.${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  const isValid = !!MIME_TYPE_MAP[file.mimetype];
  let error = isValid ? null : new Error("Invalid mime type!");
  cb(error, isValid);
};

export const fileUpload = multer({
  storage: simpanFile,
  fileFilter,
});

router.get("/users", user);
router.post(
  "/users/daftar",
  fileUpload.single("gambar"),
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
      if (value !== req.body.password)
        throw new HttpError("password harus sama", 401);
      return true;
    }),
  ],
  daftarUser
);

router.post(
  "/users/login",
  await [
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
