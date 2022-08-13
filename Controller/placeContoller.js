import itemsData from "../model/dummyData/placeData/dataPlace.js";
import HttpError from "../model/Http-Error.js";
import { v4 } from "uuid";
import { validationResult } from "express-validator";
import { geoCode } from "../model/util/getApiMap.js";
export const getAllPlace = async (req, res, next) => {
  try {
    if (itemsData.length === 0) {
      // const error = new Error("Data kosong");
      // error.statusCode = 404;
      // throw error;

      throw new HttpError("gk bisa ditemukan, data memang kosong", 404);
    }

    return res.status(200).json({
      allPlace: itemsData,
    });
  } catch (err) {
    next(err);
  }
};
export const getIdUserPlace = async (req, res, next) => {
  try {
    const idUser = req.params.uid;
    const dataPlaceUser = itemsData.filter((data) => data.creatorId === idUser);

    if (dataPlaceUser.length < 1)
      throw new HttpError("data tidak ditemukan, kocak lu", 404);

    return res.status(200).json({
      data: dataPlaceUser,
    });
  } catch (err) {
    next(err);
  }
};

export const getIdPlace = async (req, res, next) => {
  try {
    const idPlace = req.params.pid;
    const dataPlace = itemsData.filter((data) => data.id === idPlace);
    if (dataPlace.length < 1)
      throw new HttpError(" data tidak ditemukan, kocak lu", 404);
    return res.status(200).json({
      data: dataPlace[0],
    });
  } catch (err) {
    next(err);
  }
};

export const postDataPlace = async (req, res, next) => {
  try {
    const { gambarUrl, namaTempat, deskripsi, creatorId } = req.body;
    const geoCodeMap = await geoCode(namaTempat);
    console.log(geoCodeMap);
    const error = validationResult(req);
    const newPlace = {
      id: v4(),
      gambarUrl,
      namaTempat,
      alamat: await geoCodeMap.alamat,
      deskripsi,
      creatorId,
      kordinat: await geoCodeMap.cordinates,
    };
    if (!error.isEmpty()) throw new HttpError(error.array()[0].msg, 401);

    const updateData = itemsData.unshift(newPlace);
    res.status(201).json({
      newPlace,
      updateData,
      pesan: "Sukses tambah data",
    });
  } catch (err) {
    next(err);
  }
};

export const patchPlace = async (req, res, next) => {
  try {
    const idPlaceEdith = req.params.eid;
    const { namaTempat, deskripsi } = req.body;
    const editGeoCode = await geoCode(namaTempat);
    const error = validationResult(req);
    console.log(error.array());

    const dataEdithId = itemsData.filter((data) => data.id === idPlaceEdith);
    const findIndexPlace = itemsData.findIndex(
      (dataIndex) => dataIndex.id === idPlaceEdith
    );
    const hasilPlace = dataEdithId[0];
    hasilPlace.namaTempat = namaTempat;
    hasilPlace.deskripsi = deskripsi;
    hasilPlace.alamat = await editGeoCode.alamat;
    hasilPlace.kordinat = await editGeoCode.cordinates;
    if (!error.isEmpty()) throw new HttpError(error.array()[0].msg, 401);

    itemsData[findIndexPlace] = hasilPlace;
    res.status(201).json({
      hasilPlace,
      pesan: "Sukses Edith",
      itemsData,
    });
  } catch (err) {
    next(err);
  }
};

export const deletePlaceId = (req, res, next) => {
  try {
    const params = req.params.did;
    const ambilDataDariDelete = itemsData.filter((data) => data.id !== params);
    const dataDelete = itemsData.filter((data) => data.id === params);
    if (dataDelete.length !== 1)
      throw new HttpError("Tidak ada Ada yang dihapus", 404);

    res.status(201).json({
      ambilDataDariDelete,
      pesan: "sukses hapus data",
    });
  } catch (err) {
    next(err);
  }
};
