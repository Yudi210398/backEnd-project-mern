import dataUser from "../model/dummyData/userData/data.js";
import HttpError from "../model/Http-Error.js";
import { validationResult } from "express-validator";
export const user = async (req, res, next) => {
  try {
    if (dataUser.length === 0) {
      // const error = new Error("Data kosong");
      // error.statusCode = 404;
      // throw error;

      throw new HttpError("gk bisa ditemukan, data memang kosong", 404);
    }

    return res.status(200).json({
      allUser: dataUser,
    });
  } catch (err) {
    next(err);
  }
};

export const daftarUser = async (req, res, next) => {
  try {
    const { email, nama, password, passValidasi } = req.body;

    const error = validationResult(req);
    console.log(error.array());
    if (!error.isEmpty()) throw new HttpError(error.array()[0].msg, 404);
    const dataDaftar = { email, nama, password, passValidasi };
    res.status(201).json({
      dataDaftar,
      pesan: "sukses tambah data",
    });
  } catch (err) {
    next(err);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const error = validationResult(req);
    if (!error.isEmpty()) throw new HttpError(error.array()[0].msg, 404);
    const dataLogin = { email, password };
    res.status(201).json({
      dataLogin,
      pesan: "sukses login",
    });
  } catch (err) {
    next(err);
  }
};
