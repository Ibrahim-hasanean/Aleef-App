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
    // paymentIntentId: string,
    paymentChargeId: string,
    appointmentDate: Date | string,
    appointmentNumber: number,
    reason: string,
    doctor: ObjectId | StafInterface,
    user: ObjectId | UserInterface,
    medacin: ObjectId[] | PetsMedacins[],
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
    // paymentIntentId: { type: String },
    paymentChargeId: { type: String },
    appointmentDate: { type: Date },
    appointmentNumber: { type: Number },
    reason: { type: String },
    doctor: { type: mongoose.Types.ObjectId, ref: "staff" },
    user: { type: mongoose.Types.ObjectId, ref: "users" },
    medacin: [{ type: mongoose.Types.ObjectId, ref: "medicins" }],
    report: { type: String, default: "" },
    status: { type: String, default: "upcoming" },
    paymentStatus: { type: String, default: "Not Completed" },
    payment: { type: mongoose.Types.ObjectId, ref: "payments" },
    paymentType: { type: String },
    totalAmount: { type: Number },
    invoice: [{ type: mongoose.Types.ObjectId, ref: "invoices" }],

}, { timestamps: true });


appointmentSchema.pre("save", function () {
    let payment = this;
    let generatedId = Date.now();
    payment.appointmentNumber = generatedId;
})


const Appointments = mongoose.model<AppointmentsInterface>("appointments", appointmentSchema);
export default Appointments;

