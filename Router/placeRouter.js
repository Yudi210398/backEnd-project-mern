import express from "express";
import {
  deletePlaceId,
  getAllPlace,
  getIdPlace,
  getIdUserPlace,
  patchPlace,
  postDataPlace,
} from "../Controller/placeContoller.js";

const routerPlace = express.Router();
routerPlace.get("/places", getAllPlace);
routerPlace.get("/places/user/:uid", getIdUserPlace);
routerPlace.get("/places/:pid", getIdPlace);
routerPlace.post("/places", postDataPlace);
routerPlace.patch("/places/:eid", patchPlace);
routerPlace.delete("/places/:did", deletePlaceId);

export default routerPlace;
