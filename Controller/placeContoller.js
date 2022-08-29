import HttpError from "../model/Http-Error.js";
import PlaceSchema from "../model/dataReal/placeData.js";
import { validationResult } from "express-validator";
import { geoCode } from "../model/util/getApiMap.js";
import userSchema from "../model/dataReal/userdata.js";
import mongoose from "mongoose";
export const funsiCari = async (id) => {
  const dataPlace = await PlaceSchema.find();
  return dataPlace.filter((data) => data._id.toString() === id);
};

export const getAllPlace = async (req, res, next) => {
  try {
    const dataAllPlaces = await PlaceSchema.find();
    console.log(dataAllPlaces);
    if (dataAllPlaces.length === 0)
      throw new HttpError("gk bisa ditemukan, data memang kosong", 404);

    return res.status(200).json({
      allPlace: dataAllPlaces,
    });
  } catch (err) {
    next(err);
  }
};

export const getMyAllPlaces = async (req, res, next) => {
  try {
    const getUserId = req.params.uId;
    const dataUSer = await userSchema
      .findOne({ _id: getUserId })
      .populate("places");
    if (!dataUSer || dataUSer.places.length === 0)
      throw new HttpError("Data Tidak Ditemukan Bangsat", 401);
    res.status(201).json({
      dataUSer,
    });
  } catch (err) {
    next(err);
  }
};

export const getIdUserPlace = async (req, res, next) => {
  try {
    const idUser = req.params.uid;
    const dataPlace = await userSchema
      .findOne({ _id: idUser })
      .populate("places");

    if (dataPlace.length < 1 || dataPlace.places.length < 1)
      throw new HttpError("data tidak ditemukan, kocak lu", 404);

    return res.status(200).json({
      dataPlace: dataPlace.places,
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

    if (!error.isEmpty()) throw new HttpError(error.array()[0].msg, 401);
    console.log(geoCodeMap.cordinates);
    const newPlace = await new PlaceSchema({
      namaTempat,
      deskripsi,
      alamat: await geoCodeMap.alamat,
      gambar,
      kordinat: await geoCodeMap.cordinates,
      creatorId,
    });
    let user = await userSchema.findById(creatorId);
    if (!user) throw new HttpError("User Tidak Ada", 401);

    const sess = await mongoose.startSession();
    await sess.startTransaction();
    await newPlace.save({ session: sess });
    await user.places.push(newPlace);
    await user.save({ session: sess });
    await sess.commitTransaction();

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
    const { namaTempat, deskripsi, gambar } = req.body;
    const editGeoCode = await geoCode(namaTempat);
    const error = validationResult(req);
    if (!error.isEmpty()) throw new HttpError(error.array()[0].msg, 401);
    const dataEdit = await funsiCari(idPlaceEdith);
    const hasil = dataEdit[0];
    if (dataEdit.length === 0)
      throw new HttpError("gk bisa ditemukan, data memang kosong", 404);

    hasil.namaTempat = !namaTempat ? hasil.namaTempat : namaTempat;
    hasil.deskripsi = !deskripsi ? hasil.deskripsi : deskripsi;
    hasil.gambar = !gambar ? hasil.gambar : gambar;
    hasil.alamat = await editGeoCode.alamat;
    hasil.kordinat = await editGeoCode.cordinates;

    await hasil.save();
    res.status(201).json({
      hasil,
      pesan: "Sukses Edith",
    });
  } catch (err) {
    next(err);
  }
};

export const deletePlaceId = async (req, res, next) => {
  try {
    const params = req.params.did;
    const deleteData = await PlaceSchema.findById(params).populate("creatorId");
    if (!deleteData) throw new HttpError("data tempat tidak ada", 401);

    const sess = await mongoose.startSession();
    await sess.startTransaction();
    await deleteData.remove({ session: sess });
    await deleteData.creatorId.places.pull(deleteData._id);
    await deleteData.creatorId.save();
    await sess.commitTransaction();

    res.status(201).json({
      pesan: "sukses hapus data",
    });
  } catch (err) {
    next(err);
  }
};
