import mongoose, { Schema, ObjectId } from "mongoose";

export interface PaymentInterFace extends mongoose.Document {
    totalAmount: number,
    discount: number,
    paymentAmmount: number,
    exchange: number,
    paymentType: string,
    user: ObjectId | string
}

const payemntSchema = new Schema({
    totalAmount: { type: Number, required: true },
    discount: { type: Number },
    paymentAmmount: { type: Number, required: true },
    exchange: { type: Number },
    paymentType: { type: String, required: true },
    user: { type: mongoose.Types.ObjectId, ref: "users" }
});

const Payment = mongoose.model("payments", payemntSchema);

export default Payment;
