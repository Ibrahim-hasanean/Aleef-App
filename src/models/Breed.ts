import mongoose, { Schema, ObjectId } from "mongoose";
import { PetsTypesInterface } from "./PetsTypes";
import { UserInterface } from "./User";

export interface BreedInterface extends mongoose.Document {
    name: string,
    type: ObjectId | PetsTypesInterface
}

const breedSchema = new Schema({
    name: { type: String, required: true },
    type: { type: mongoose.Types.ObjectId, ref: "petsTypes" },
});

const Breeds = mongoose.model<BreedInterface>("breeds", breedSchema);

export default Breeds;

