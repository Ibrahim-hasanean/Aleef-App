import mongoose, { Schema, ObjectId } from "mongoose";
import { UserInterface } from "./User";


export interface CardInfoInterface extends mongoose.Document {
    cardNumber: string
    cardHolderName: string
    user: UserInterface | ObjectId
}

const cardInfoSchema = new Schema({
    cardNumber: { type: String, required: true },
    cardHolderName: { type: String },
    user: { type: mongoose.Types.ObjectId, ref: "users" },

})


const cardInfo = mongoose.model("cardInfo", cardInfoSchema);

export default cardInfo