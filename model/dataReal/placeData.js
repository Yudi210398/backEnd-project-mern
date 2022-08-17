import mongoose from "mongoose";

const Schema = mongoose.Schema;

const PlaceSchema = new Schema({
  namaTempat: { type: String, require: true },
  deskripsi: { type: String, require: true },
  alamat: { type: String, require: true },
  gambar: { type: String, require: true },
  kordinat: {
    lat: { type: Number, require: true },
    lng: { type: Number, require: true },
  },
  creatorId: { type: Schema.Types.ObjectId, ref: "UserSchema", require: true },
});

export default mongoose.model("PlaceSchema", PlaceSchema);
