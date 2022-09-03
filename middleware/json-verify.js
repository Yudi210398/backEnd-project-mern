import jwt from "jsonwebtoken";
import HttpError from "../model/Http-Error.js";

export const jsonVerify = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) throw new HttpError("auth failed, anda belum login", 401);
    const decode = jwt.verify(token, "rahasia_ilahi");
    req.userData = decode;
    next();
  } catch (err) {
    const error = new HttpError("auth failed, anda belum login", 401);
    return next(error);
  }
};
