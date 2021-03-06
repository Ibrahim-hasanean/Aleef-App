import mongoose, { Schema, ObjectId } from "mongoose";
import { AppointmentsInterface } from "./Appointments";
import { PetsInterface } from "./Pets";

export interface PetsMedacins extends mongoose.Document {
    name: string
    repetition: number
    duration: number
    pet: ObjectId | PetsInterface | string
    appointment: ObjectId | AppointmentsInterface
    notes: string
    createdAt: Date
    updatedAt: Date
}

const medicinSchema = new Schema({
    name: { type: String, required: true },
    repetition: { type: Number, default: 1 },
    duration: { type: Number },
    pet: { type: mongoose.Types.ObjectId, ref: "pets" },
    appointment: { type: mongoose.Types.ObjectId, ref: "appointments" },
    notes: { type: String }
}, { timestamps: true })

const medicins = mongoose.model<PetsMedacins>("medicins", medicinSchema);

export default medicins;
