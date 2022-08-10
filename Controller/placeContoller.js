import itemsData from "../model/dummyData/placeData/dataPlace.js";
import HttpError from "../model/Http-Error.js";
import { v4 } from "uuid";

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
      throw new HttpError(" data tidak ditemukan, kocak lu", 404);

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
  const { gambarUrl, namaTempat, alamat, deskripsi, creatorId, kordinat } =
    req.body;

  const newPlace = {
    id: v4(),
    gambarUrl,
    namaTempat,
    alamat,
    deskripsi,
    creatorId,
    kordinat,
  };

  const updateData = itemsData.unshift(newPlace);
  res.status(201).json({
    newPlace,
    updateData,
    pesan: "Sukses tambah data",
  });
};

export const patchPlace = async (req, res, next) => {
  const idPlaceEdith = req.params.eid;
  const { namaTempat, alamat } = req.body;
  const dataEdithId = itemsData.filter((data) => data.id === idPlaceEdith);
  const findIndexPlace = itemsData.findIndex(
    (dataIndex) => dataIndex.id === idPlaceEdith
  );
  const hasilPlace = dataEdithId[0];
  hasilPlace.namaTempat = namaTempat;
  hasilPlace.alamat = alamat;
  itemsData[findIndexPlace] = hasilPlace;
  res.status(201).json({
    hasilPlace,
    pesan: "Sukses Edith",
    itemsData,
  });
};
