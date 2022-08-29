import bcrypt from "bcrypt";
import userSchema from "../model/dataReal/userdata.js";
import HttpError from "../model/Http-Error.js";
import { validationResult } from "express-validator";

export const user = async (req, res, next) => {
  try {
    const dataUser = await userSchema.find({}, "-password");
    if (dataUser.length === 0)
      throw new HttpError("gk bisa ditemukan, data memang kosong", 404);

    return res.status(200).json({
      allUser: dataUser,
    });
  } catch (err) {
    next(err);
  }
};

export const daftarUser = async (req, res, next) => {
  try {
    const { email, nama, password, deskripsi } = req.body;
    const data = await userSchema.find({ email });
    if (data.length > 0) throw new HttpError("Email sudah digunakan", 404);
    const error = validationResult(req);
    if (!error.isEmpty()) throw new HttpError(error.array()[0].msg, 404);

    await bcrypt.hash(password, 10, async (err, hash) => {
      try {
        if (err) throw new HttpError("Tidak bisa encrype password", 401);
        else {
          const daftar = await new userSchema({
            email,
            nama,
            deskripsi,
            gambar: req.file.path,
            password: hash,
            places: [],
          }).save();

          res.status(201).json({
            userss: daftar.toObject({ getters: true }),
            pesan: "sukses tambah data",
          });
        }
      } catch (err) {
        next(err);
      }
    });
  } catch (err) {
    next(err);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const error = validationResult(req);
    console.log(email, password);
    if (!error.isEmpty()) throw new HttpError(error.array()[0].msg, 401);

    const dataPAssword = await userSchema.findOne({ email });

    await bcrypt.compare(password, dataPAssword.password, (err, result) => {
      try {
        if (!result) throw new HttpError("Password Salah", 401);
        res.status(201).json({
          pesan: "sukses login",
          userId: dataPAssword._id,
        });
      } catch (err) {
        next(err);
      }
    });
  } catch (err) {
    next(err);
  }
};
