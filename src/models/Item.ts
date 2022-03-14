import mongoose, { Schema, ObjectId } from "mongoose";

export interface ItemInterface extends mongoose.Document {
    name: string
    description: string
    price: number
    review: number
    numberOfReviews: number
    sumOfReviews: number
    category: string
    serialNumber: number
    avaliableQuantity: number
    allowed: boolean
    shippingPrice: number
    additionDate: Date
    soldQuantity: number
    usersLiked: string[],
    mainImageUrl: string,
    images: string[]
}


const itemSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number },
    review: { type: Number, default: 0 },
    numberOfReviews: { type: Number, default: 0 },
    sumOfReviews: { type: Number, default: 0 },
    category: { type: String },
    usersLiked: [{ type: mongoose.Types.ObjectId, ref: "users" }],
    serialNumber: { type: Number },
    avaliableQuantity: { type: Number },
    allowed: { type: Boolean },
    shippingPrice: { type: Number },
    additionDate: { type: Date },
    soldQuantity: { type: Number, default: 0 },
    mainImageUrl: { type: String },
    images: [{ type: String }]
}, { timestamps: true })

const Item = mongoose.model("items", itemSchema);

export default Item;

