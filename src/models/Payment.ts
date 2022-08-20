import mongoose, { Schema, ObjectId } from "mongoose";
import { paymentSchema } from "../Components/Users/middleware/userPaymentsValidation";
import { AppointmentsInterface } from "./Appointments";
import { OrderInterface } from "./Order";
import { UserInterface } from "./User";

export interface PaymentInterFace extends mongoose.Document {
    totalAmount: number,
    discount: number,
    paymentNumber: number,
    paymentAmmount: number,
    exchange: number,
    paymentType: string,
    // paymentIntentId: string
    paymentChargeId: string
    user: ObjectId | UserInterface | null
    appointment: AppointmentsInterface | ObjectId | null
    order: OrderInterface | ObjectId | null
}

const payemntSchema = new Schema({
    // paymentIntentId: { type: String },
    paymentChargeId: { type: String },
    totalAmount: { type: Number, required: true },
    discount: { type: Number },
    paymentNumber: { type: Number },
    paymentAmmount: { type: Number, required: true },
    exchange: { type: Number },
    paymentType: { type: String, required: true },
    user: { type: mongoose.Types.ObjectId, ref: "users" },
    appointment: { type: mongoose.Types.ObjectId, ref: "appointments" },
    order: { type: mongoose.Types.ObjectId, ref: "orders" }
}, { timestamps: true });

payemntSchema.pre("save", function () {
    let payment = this;
    let generatedId = Date.now();
    payment.paymentNumber = generatedId;
})

const Payment = mongoose.model<PaymentInterFace>("payments", payemntSchema);

export default Payment;
