import axios from "axios";
import HttpError from "../http-error.js";
export const geoCode = async (alamat) => {
  const respone = await axios(
    `https://nominatim.openstreetmap.org/?addressdetails=1&q=${encodeURIComponent(
      alamat
    )}&format=json&limit=1`
  );

  const data = respone.data;
  if (!data || data.length === 0)
    throw new HttpError("Tidak bisa menemukan lokasi", 422);

  const dataAll = {
    cordinates: { lat: data[0].lat, lng: data[0].lon },
    alamat: data[0].display_name,
  };
  return dataAll;
};
