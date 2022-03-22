import mongoose, { Schema, ObjectId } from "mongoose";
import { AddressInterface } from "./Address";
import { OrdersItemsInterface } from "./OrderItems";
import { PaymentInterFace } from "./Payment";
import { UserInterface } from "./User";


export interface OrderInterface extends mongoose.Document {
    totalPrice: number,
    itemsCount: number,
    paymentIntentId: string,
    items: OrdersItemsInterface,
    shippingFees: number,
    subTotal: number,
    shippingAddress: ObjectId | AddressInterface,
    cardNumber: string,
    cardHolderName: string,
    ExperitionDate: string,
    SecurityCode: string,
    user: ObjectId | UserInterface,
    status: string,
    currency: string,
    payment: ObjectId | PaymentInterFace
}

const orderSchema = new Schema({
    totalPrice: { type: Number },
    itemsCount: { type: Number },
    paymentIntentId: { type: String },
    items: [{ type: mongoose.Types.ObjectId, ref: "orderItems" }],
    shippingFees: { type: Number },
    subTotal: { type: Number },
    shippingAddress: { type: mongoose.Types.ObjectId, ref: "addresses" },
    cardNumber: { type: String },
    cardHolderName: { type: String },
    ExperitionDate: { type: String },
    SecurityCode: { type: String },
    user: { type: mongoose.Types.ObjectId, ref: "users", required: true },
    status: { type: String },
    currency: { type: String },
    payment: { type: mongoose.Types.ObjectId, ref: "payments" },

}, { timestamps: true });


const Order = mongoose.model("orders", orderSchema);

export default Order;
