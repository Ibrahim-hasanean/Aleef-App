import mongoose, { Schema, ObjectId } from "mongoose";
import { PetsInterface } from "./Pets";

export interface PetsVaccination extends mongoose.Document {
    name: string
    pet: ObjectId | PetsInterface | string
    date: Date
    repetition: number
    durations: number
    notes: string
}

const vaccinationSchema = new Schema({
    name: { type: String, required: true },
    pet: { type: mongoose.Types.ObjectId, ref: "pets" },
    // dates: [{ type: Date, required: true }],
    date: { type: Date, required: true },
    repetition: { type: Number, default: 1 },
    durations: { type: Number, default: 1 },
    notes: { type: String }
}, { timestamps: true })

const Vaccination = mongoose.model<PetsVaccination>("vaccination", vaccinationSchema);

export default Vaccination;