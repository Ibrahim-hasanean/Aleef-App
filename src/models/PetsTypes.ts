import mongoose, { Schema, ObjectId } from "mongoose";
import { BreedInterface } from "./Breed";
import { UserInterface } from "./User";

export interface PetsTypesInterface extends mongoose.Document {
    name: string,
    breeds: ObjectId[] | BreedInterface[]
}

const petsTypesSchema = new Schema({
    name: { type: String, required: true },
    breeds: [{ type: mongoose.Types.ObjectId, ref: "breeds" }],
});

const petsTypes = mongoose.model<PetsTypesInterface>("petsTypes", petsTypesSchema);

export default petsTypes;

