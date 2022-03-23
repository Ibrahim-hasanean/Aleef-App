import mongoose, { Schema, ObjectId } from "mongoose";
import { PaymentInterFace } from "./Payment";
import { PetsInterface } from "./Pets";
import { ServicesInterface } from "./Services";
import { StafInterface } from "./Staff";
import { UserInterface } from "./User";
import { PetsMedacins } from "./Medacine";
import { InvoiceInterface } from "./Invoice";

export interface AppointmentsInterface extends mongoose.Document {
    pet: ObjectId | PetsInterface | string,
    service: string,
    paymentIntentId: string,
    appointmentDate: Date | string,
    reason: string,
    doctor: ObjectId | StafInterface,
    user: ObjectId | UserInterface,
    medacin: ObjectId | PetsMedacins,
    status: string,
    report: string,
    paymentStatus: string,
    payment: ObjectId | PaymentInterFace | null,
    paymentType: string
    invoice: ObjectId[] | InvoiceInterface[],
    totalAmount: number
}

const appointmentSchema = new Schema({
    pet: { type: mongoose.Types.ObjectId, ref: "pets" },
    service: { type: String },
    paymentIntentId: { type: String },
    appointmentDate: { type: Date },
    reason: { type: String },
    doctor: { type: mongoose.Types.ObjectId, ref: "staff" },
    user: { type: mongoose.Types.ObjectId, ref: "users" },
    medacin: { type: mongoose.Types.ObjectId, ref: "medicins" },
    report: { type: String, default: "" },
    status: { type: String },
    paymentStatus: { type: String, default: "Not Completed" },
    payment: { type: mongoose.Types.ObjectId, ref: "payments" },
    paymentType: { type: String },
    totalAmount: { type: Number },
    invoice: [{ type: mongoose.Types.ObjectId, ref: "invoices" }],

}, { timestamps: true });

const Appointments = mongoose.model<AppointmentsInterface>("appointments", appointmentSchema);
export default Appointments;

