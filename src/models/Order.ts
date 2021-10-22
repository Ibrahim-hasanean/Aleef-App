import mongoose, { Schema, ObjectId } from "mongoose";
import { AddressInterface } from "./Address";
import { OrdersItemsInterface } from "./OrderItems";
import { UserInterface } from "./User";


export interface OrderInterface extends mongoose.Document {
    totalPrice: number,
    itemsCount: number,
    items: OrdersItemsInterface,
    shippingFees: number,
    shippingAddress: ObjectId | AddressInterface,
    cardNumber: string,
    user: ObjectId | UserInterface,
    status: string,
    paymentId: string
}

const orderSchema = new Schema({
    totalPrice: { type: Number },
    itemsCount: { type: Number },
    items: [{ type: mongoose.Types.ObjectId, ref: "orderItems" }],
    shippingFees: { type: Number },
    shippingAddress: { type: mongoose.Types.ObjectId, ref: "addresses" },
    cardNumber: { type: String },
    user: { type: mongoose.Types.ObjectId, ref: "users", required: true },
    status: { type: String },
    paymentId: { type: String }
})

const Order = mongoose.model("orders", orderSchema);

export default Order;
