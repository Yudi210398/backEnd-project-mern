import dataUser from "../model/dummyData/userData/data.js";
import HttpError from "../model/Http-Error.js";

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
