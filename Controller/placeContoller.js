import itemsData from "../model/dummyData/placeData/dataPlace.js";
import HttpError from "../model/Http-Error.js";
import PlaceSchema from "../model/dataReal/placeData.js";
import { validationResult } from "express-validator";
import { geoCode } from "../model/util/getApiMap.js";

export const funsiCari = async (id) => {
  const dataPlace = await PlaceSchema.find();
  return dataPlace.filter((data) => data._id.toString() === id);
};
export const getAllPlace = async (req, res, next) => {
  try {
    if (itemsData.length === 0)
      throw new HttpError("gk bisa ditemukan, data memang kosong", 404);

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
    const dataPlace = await PlaceSchema.find();
    const data = dataPlace.filter((data) => data.creatorId === idUser);
    if (data.length < 1)
      throw new HttpError("data tidak ditemukan, kocak lu", 404);

    return res.status(200).json({
      data,
      pesan: "Sukses Get Data",
    });
  } catch (err) {
    next(err);
  }
};

export const getIdPlace = async (req, res, next) => {
  try {
    const idPlace = req.params.pid;
    const filter = await funsiCari(idPlace);

    if (filter.length < 1)
      throw new HttpError(" data tidak ditemukan, kocak lu", 404);
    return res.status(200).json({
      data: filter[0],
    });
  } catch (err) {
    next(err);
  }
};

export const postDataPlace = async (req, res, next) => {
  try {
    const { gambar, namaTempat, deskripsi, creatorId } = req.body;
    const geoCodeMap = await geoCode(namaTempat);
    const error = validationResult(req);
    // const newPlace = {
    //   id: v4(),
    //   gambarUrl,
    //   namaTempat,
    //   alamat: await geoCodeMap.alamat,
    //   deskripsi,
    //   creatorId,
    //   kordinat: await geoCodeMap.cordinates,
    // };

    if (!error.isEmpty()) throw new HttpError(error.array()[0].msg, 401);

    const newPlace = await new PlaceSchema({
      namaTempat,
      deskripsi,
      alamat: await geoCodeMap.alamat,
      gambar,
      kordinat: await geoCodeMap.cordinates,
      creatorId,
    }).save();

    res.status(201).json({
      newPlace,
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
    if (!error.isEmpty()) throw new HttpError(error.array()[0].msg, 401);
    const dataEdit = await funsiCari(idPlaceEdith);
    const hasil = dataEdit[0];
    if (dataEdit.length === 0)
      throw new HttpError("gk bisa ditemukan, data memang kosong", 404);

    hasil.namaTempat = !namaTempat ? hasil.namaTempat : namaTempat;
    hasil.deskripsi = !deskripsi ? hasil.deskripsi : deskripsi;
    hasil.alamat = await editGeoCode.alamat;
    hasil.kordinat = await editGeoCode.cordinates;

    await hasil.save();
    res.status(201).json({
      hasil,
      pesan: "Sukses Edith",
    });
    // const dataEdithId = itemsData.filter((data) => data.id === idPlaceEdith);

    // const findIndexPlace = itemsData.findIndex(
    //   (dataIndex) => dataIndex.id === idPlaceEdith
    // );
    // const hasilPlace = dataEdithId[0];
    // hasilPlace.namaTempat = namaTempat;
    // hasilPlace.deskripsi = deskripsi;
    // hasilPlace.alamat = await editGeoCode.alamat;
    // hasilPlace.kordinat = await editGeoCode.cordinates;
    // if (!error.isEmpty()) throw new HttpError(error.array()[0].msg, 401);

    // itemsData[findIndexPlace] = hasilPlace;
    // res.status(201).json({
    //   hasilPlace,
    //   pesan: "Sukses Edith",
    //   itemsData,
    // });
  } catch (err) {
    next(err);
  }
};

export const deletePlaceId = async (req, res, next) => {
  try {
    const params = req.params.did;
    const deleteData = await PlaceSchema.findByIdAndRemove(params);
    if (deleteData)
      res.status(201).json({
        deleteData,
        pesan: "sukses hapus data",
      });
  } catch (err) {
    next(err);
  }
};
