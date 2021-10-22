import mongoose, { Schema, ObjectId } from "mongoose";
import { UserInterface } from "./User";

export interface GenderInterface extends mongoose.Document {
    name: string
}

const genderSchema = new Schema({
    name: { type: String, required: true },
});

const gender = mongoose.model<GenderInterface>("gender", genderSchema);

export default gender;

