import mongoose, { Schema, ObjectId } from "mongoose";

export interface ItemInterface extends mongoose.Document {
    name: string
    description: string
    price: number
    reviews: number
    category: ObjectId
    serialNumber: number
    avaliableQuantity: number
    allowed: boolean
    shippingPrice: number
    additionDate: Date
    soldQuantity: number
    usersLiked: string[]
}


const itemSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number },
    reviews: { type: Number },
    category: { type: mongoose.Types.ObjectId, ref: "itemsCategory" },
    usersLiked: [{ type: mongoose.Types.ObjectId, ref: "users" }],
    serialNumber: { type: Number },
    avaliableQuantity: { type: Number },
    allowed: { type: Boolean },
    shippingPrice: { type: Number },
    additionDate: { type: Date },
    soldQuantity: { type: Number },
})

const Item = mongoose.model("items", itemSchema);

export default Item;

