import mongoose, { Schema, ObjectId } from "mongoose";
import { AppointmentsInterface } from "./Appointments";
import { StafInterface } from "./Staff";
import { UserInterface } from "./User";
export interface InvoiceInterface extends mongoose.Document {
    paymentAmount: number
    reason: string
    appointment: ObjectId | AppointmentsInterface
    user: ObjectId | UserInterface
    addedBy: ObjectId | StafInterface
}

const invoiceSchema = new Schema({
    paymentAmount: { type: Number, required: true },
    reason: { type: String },
    appointment: { type: mongoose.Types.ObjectId, ref: "appointments" },
    user: { type: mongoose.Types.ObjectId, ref: "users" },
    addedBy: { type: mongoose.Types.ObjectId, ref: "staff" },
});

const Invoice = mongoose.model<InvoiceInterface>("invoices", invoiceSchema);

export default Invoice;