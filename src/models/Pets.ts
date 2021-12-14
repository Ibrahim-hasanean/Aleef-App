import mongoose, { Schema, ObjectId } from "mongoose";
import { BreedInterface } from "./Breed";
import { PetsMedacins } from "./Medacine";
import { PetsTypesInterface } from "./PetsTypes";
import { UserInterface } from "./User";
import { PetsVaccination } from "./Vaccination";
import { AppointmentsInterface } from "./Appointments";

export interface PetsInterface extends mongoose.Document {
    name: string
    serialNumber: string
    age: number
    type: ObjectId | PetsTypesInterface
    imageUrl: string
    user: ObjectId | UserInterface
    appointments: ObjectId[] | AppointmentsInterface[]
    breed: ObjectId | BreedInterface
    vaccinations: ObjectId[] | PetsVaccination[]
    medacins: ObjectId[] | PetsMedacins[]
    gender: string
    microshipNumber: number
    weight: number
    notes: string
    nutried: boolean
    duerming: boolean
    // lastCheckUp: Date
}

const petsSchema = new Schema({
    name: { type: String },
    serialNumber: { type: String },
    age: { type: Number },
    type: { type: mongoose.Types.ObjectId, ref: "petsTypes" },
    imageUrl: { type: String },
    user: { type: mongoose.Types.ObjectId, ref: "users" },
    appointments: [{ type: mongoose.Types.ObjectId, ref: "appointments" }],
    breed: { type: mongoose.Types.ObjectId, ref: "breeds" },
    vaccinations: [{ type: mongoose.Types.ObjectId, ref: "vaccination" }],
    medacins: [{ type: mongoose.Types.ObjectId, ref: "medicins" }],
    gender: { type: String },
    microshipNumber: { type: Number },
    weight: { type: Number },
    notes: { type: String },
    // lastCheckUp: { type: Date }
    nutried: { type: Boolean },
    duerming: { type: Boolean }
});

const Pets = mongoose.model<PetsInterface>("pets", petsSchema);

export default Pets;

