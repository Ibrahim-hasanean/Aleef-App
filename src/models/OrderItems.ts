import mongoose, { Schema, ObjectId } from "mongoose";
import { ItemInterface } from "./Item";

export interface OrdersItemsInterface extends mongoose.Document {
    item: ObjectId | ItemInterface
    count: number
}

const orderItemsSchema = new Schema({
    item: { type: mongoose.Types.ObjectId, ref: "items" },
    count: { type: Number }
});

const OrderItems = mongoose.model("orderItems", orderItemsSchema);
export default OrderItems;