import mongoose from "mongoose";
import mongooseUniqueValidator from "mongoose-unique-validator";

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  nama: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  deskripsi: { type: String, required: true },
  gambar: { type: String },
  places: [{ type: Schema.Types.ObjectId, ref: "PlaceSchema", required: true }],
});

UserSchema.plugin(mongooseUniqueValidator);

export default mongoose.model("UserSchema", UserSchema);
  