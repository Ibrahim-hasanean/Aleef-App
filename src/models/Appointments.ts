import mongoose, { Schema, ObjectId } from "mongoose";
import { OrderInterface } from "./Order";
import { PetsInterface } from "./Pets";
import { ServicesInterface } from "./Services";
import { StafInterface } from "./Staff";
import { UserInterface } from "./User";

export interface AppointmentsInterface extends mongoose.Document {
    pet: ObjectId | PetsInterface,
    service: ObjectId | ServicesInterface,
    appointmentDate: Date,
    reason: string,
    doctor: ObjectId | StafInterface,
    user: ObjectId | UserInterface,
    status: string,
    paymentStatus: string,
    payment: ObjectId | OrderInterface | null,
    paymentType: string
}

const appointmentSchema = new Schema({
    petId: { type: mongoose.Types.ObjectId, ref: "pets" },
    service: { type: mongoose.Types.ObjectId, ref: "services" },
    appointmentDate: { type: Date },
    reason: { type: String },
    doctor: { type: mongoose.Types.ObjectId, ref: "staff" },
    user: { type: mongoose.Types.ObjectId, ref: "users" },
    status: { type: String },
    paymentStatus: { type: String },
    payment: { type: mongoose.Types.ObjectId, ref: "orders" },
    paymentType: { type: String }

}, { timestamps: true });

const Appointments = mongoose.model<AppointmentsInterface>("appointments", appointmentSchema);
export default Appointments;

