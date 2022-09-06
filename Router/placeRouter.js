import express from "express";
import {
  deletePlaceId,
  getAllPlace,
  getIdPlace,
  getIdUserPlace,
  getMyAllPlaces,
  patchPlace,
  postDataPlace,
} from "../Controller/placeContoller.js";
import { body } from "express-validator";
import { fileUpload } from "./userRouter.js";
import { jsonVerify } from "../middleware/json-verify.js";
const validateFactor = () => {
  return [
    body("namaTempat").isString().trim().notEmpty(),
    body("deskripsi")
      .isString()
      .trim()
      .isLength({ min: 5 })
      .withMessage("Karketer Minilal 5 huruf bole anggka"),
  ];
};
const routerPlace = express.Router();
routerPlace.get("/places", getAllPlace);
routerPlace.get("/places/user/:uid", getIdUserPlace);
routerPlace.get("/places/myallplaces/:uId", getMyAllPlaces);
routerPlace.get("/places/:pid", getIdPlace);
routerPlace.post(
  "/places",
  fileUpload.single("gambar"),
  validateFactor(),
  jsonVerify,
  postDataPlace
);
routerPlace.patch(
  "/places/:eid",
  fileUpload.single("gambar"),
  validateFactor(),
  jsonVerify,
  patchPlace
);
routerPlace.delete("/places/:did", jsonVerify, deletePlaceId);

export default routerPlace;
