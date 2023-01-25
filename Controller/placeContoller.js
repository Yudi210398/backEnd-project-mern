import HttpError from "../model/http-error.js";
import PlaceSchema from "../model/dataReal/placeData.js";
import { validationResult } from "express-validator";
import { geoCode } from "../model/util/getApiMap.js";
import userSchema from "../model/dataReal/userdata.js";
import mongoose from "mongoose";
import fs from "fs";
export const funsiCari = async (id) => {
  const dataPlace = await PlaceSchema.find();
  return dataPlace.filter((data) => data._id.toString() === id);
};

export const getAllPlace = async (req, res, next) => {
  try {
    const dataAllPlaces = await PlaceSchema.find();

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
    const { namaTempat, deskripsi } = req.body;
    const geoCodeMap = await geoCode(namaTempat);
    const error = validationResult(req);

    if (!error.isEmpty()) throw new HttpError(error.array()[0].msg, 401);
    const newPlace = await new PlaceSchema({
      namaTempat,
      deskripsi,
      alamat: await geoCodeMap.alamat,
      gambar: req.file.path,
      kordinat: await geoCodeMap.cordinates,
      creatorId: req.userData.id,
    });
    let user = await userSchema.findById(req.userData.id);
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
    if (dataEdit.length === 0 || null)
      throw new HttpError("gk bisa ditemukan, data memang kosong", 404);
    if (hasil.creatorId.toString() !== req.userData.id)
      throw new HttpError("kamu bukan pengguna sesunggunya", 401);

    fs.unlink(hasil.gambar, (err) => console.log(err, ` `));

    hasil.namaTempat = namaTempat;
    hasil.deskripsi = deskripsi;
    hasil.gambar = req.file.path;
    hasil.alamat = await editGeoCode.alamat;
    hasil.kordinat = await editGeoCode.cordinates;

    await hasil.save();
    res.status(201).json({
      hasil,
      pesan: "Sukses Edith",
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

export const deletePlaceId = async (req, res, next) => {
  try {
    const params = req.params.did;
    const deleteData = await PlaceSchema.findById(params).populate("creatorId");
    if (!deleteData) throw new HttpError("data tempat tidak ada", 401);
    if (deleteData.creatorId._id.toString() !== req.userData.id)
      throw new HttpError("kamu bukan pengguna sesunggunya", 401);
    const sess = await mongoose.startSession();
    await sess.startTransaction();
    await deleteData.remove({ session: sess });
    await deleteData.creatorId.places.pull(deleteData._id);
    await deleteData.creatorId.save();
    await sess.commitTransaction();

    fs.unlink(deleteData.gambar, (err) => console.log(err));
    res.status(201).json({
      pesan: "sukses hapus data",
    });
  } catch (err) {
    next(err);
  }
};
