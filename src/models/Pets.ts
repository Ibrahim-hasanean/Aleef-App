import mongoose, { Schema, ObjectId } from "mongoose";
import { BreedInterface } from "./Breed";
import { PetsTypesInterface } from "./PetsTypes";
import { UserInterface } from "./User";

export interface PetsInterface extends mongoose.Document {
    name: string
    serialNumber: string
    age: number
    type: ObjectId | PetsTypesInterface
    imageUrl: string
    user: ObjectId | UserInterface
    breed: ObjectId | BreedInterface
    gender: ObjectId
    microshipNumber: number
    weight: number
    notes: string
    lastCheckUp: Date
}

const petsSchema = new Schema({
    name: { type: String },
    serialNumber: { type: String },
    age: { type: Number },
    type: { type: mongoose.Types.ObjectId, ref: "petsTypes" },
    imageUrl: { type: String },
    user: { type: mongoose.Types.ObjectId, ref: "users" },
    breed: { type: mongoose.Types.ObjectId, ref: "breeds" },
    gender: { type: mongoose.Types.ObjectId, ref: "gender" },
    microshipNumber: { type: Number },
    weight: { type: Number },
    notes: { type: String },
    lastCheckUp: { type: Date }
});

const Pets = mongoose.model<PetsInterface>("pets", petsSchema);

export default Pets;

