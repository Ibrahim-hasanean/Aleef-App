import mongoose, { Schema, ObjectId } from "mongoose";
import { AppointmentsInterface } from "./Appointments";
import { OrderInterface } from "./Order";
import { UserInterface } from "./User";

export interface PaymentInterFace extends mongoose.Document {
    totalAmount: number,
    discount: number,
    paymentAmmount: number,
    exchange: number,
    paymentType: string,
    user: ObjectId | UserInterface | null
    appointment: AppointmentsInterface | ObjectId | null
    order: OrderInterface | ObjectId | null
}

const payemntSchema = new Schema({
    totalAmount: { type: Number, required: true },
    discount: { type: Number },
    paymentAmmount: { type: Number, required: true },
    exchange: { type: Number },
    paymentType: { type: String, required: true },
    user: { type: mongoose.Types.ObjectId, ref: "users" },
    appointment: { type: mongoose.Types.ObjectId, ref: "appointments" },
    order: { type: mongoose.Types.ObjectId, ref: "orders" }
}, { timestamps: true });

const Payment = mongoose.model<PaymentInterFace>("payments", payemntSchema);

export default Payment;
