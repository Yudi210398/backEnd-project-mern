import mongoose from "mongoose";

const Schema = mongoose.Schema;

const PlaceSchema = new Schema({
  namaTempat: { type: String, required: true },
  deskripsi: { type: String, required: true },
  alamat: { type: String, required: true },
  gambar: { type: String, required: true },
  kordinat: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  creatorId: { type: Schema.Types.ObjectId, ref: "UserSchema", required: true },
});

export default mongoose.model("PlaceSchema", PlaceSchema);
